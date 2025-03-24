import { Bot as GrammyBot, GrammyError, HttpError, Context, session, SessionFlavor, InlineKeyboard } from "grammy";
import * as dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";
import { User } from "./src/entity/User";
import { checkUserExist } from './util/existCheck'
import {loveLangKeyboard, bioKeyboard1, bioKeyboard2, zodiacKeyboard, commTypeKeyboard, typePersKeyboard, kidsKeyboard, educationKeyboard, mySearchKeyboard} from './util/keyboards'
import { CALLBACK } from "./util/callBackQuery";
dotenv.config();

interface FormSession {
  step: "askConsent" | "askName" | "askAge" | "waiting" | "editingProfile" | "extraInfo" |
  "searchProfiles" | null;
  chatId?: string;
  name?: string;
  age?: number;
  editing?: boolean;
}

type MyContext = Context & SessionFlavor<FormSession>;

const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN as string);



AppDataSource.initialize()
  .then(async () => {
    bot.use(
      session({
        initial: (): FormSession => ({ step: "askConsent" }),
      })
    );

    bot.command("start", async (ctx) => {
      const chatId = String(ctx.chat.id);
      if (await checkUserExist(ctx) === false) {
        ctx.session = { step: "askConsent", chatId };
        await ctx.reply("Привет! Твоя анкета не была найдена. Давай создадим её (Да/Нет)");
      } else {
        await ctx.reply("У вас уже пройдена регистрация.\n\nЕсли вы желаете изменить анкету, наберите /edit.");
      }
    });

    bot.command('edit', async (ctx) => {
        ctx.session.editing = true
        const chatId = String(ctx.chat.id)
        ctx.reply(`${ctx.from.first_name}, Твой профиль сейчас выглядит так: ${(await AppDataSource.manager.findOneBy(User, { chatId })).name}, ${(await AppDataSource.manager.findOneBy(User, { chatId })).age}`, {
            reply_markup: bioKeyboard1
        })
    })
    bot.on('callback_query', async (ctx) => {
        const chatId = String(ctx.chat.id)
        if(ctx.session.editing === true){
            ctx.answerCallbackQuery('минутку')
            CALLBACK(ctx)

            
        }
    })
    
    bot.on("message:text", async (ctx) => {
      const text = ctx.message.text.trim();
      const chatId = String(ctx.chat.id);
      let user = await AppDataSource.manager.findOneBy(User, { chatId });
      if (!user) {
        user = new User();
        user.chatId = chatId;
      }

      switch (ctx.session.step) {
        case "askConsent":
          if (text.toLowerCase() === "да") {
            ctx.react('❤‍🔥')
            ctx.session.step = "askName";
            await ctx.reply("Отлично! Напиши своё имя:");
          } else {
            ctx.react('💔')
            await ctx.reply("Хорошо, если передумаешь — напиши /start.");
            ctx.session.step = null;
          }
          break;

        case "askName":
          ctx.session.name = text; // Сохраняем имя в сессии
          if (ctx.session.name.length >= 25){
            await ctx.reply('Имя слишком длинное')
            return
          }
          ctx.session.step = "askAge";
          await ctx.reply("Теперь напиши возраст:");
          break;

        case "askAge":
          const age = Number(text);
          if (isNaN(age)) {
            await ctx.reply("Напиши цифру.");
            return;
          }
          ctx.session.age = age
          ctx.session.step = "extraInfo"
          await ctx.reply("Хочешь написать еще о себе?")
          break;

        case "extraInfo":
            if (text.toLowerCase() === "да") {
                ctx.react('🔥')
                ctx.session.step = "extraInfo";
                await ctx.reply("Отлично! Давай продолжим!");
                user.regPassed = true
                user.name = ctx.session.name;
                user.age = ctx.session.age;
                await AppDataSource.manager.save(user)
                ctx.session.step = "extraInfo"
                ctx.reply(`${ctx.from.first_name}, Твой профиль сейчас выглядит так: ${(await AppDataSource.manager.findOneBy(User, { chatId })).name}, ${(await AppDataSource.manager.findOneBy(User, { chatId })).age}`, {
                    reply_markup: bioKeyboard1
                })
                ctx.session.editing = true
              } else {
                ctx.reply("Хорошо. Как нибудь в другой раз!")
                user.regPassed = true
                user.name = ctx.session.name;
                user.age = ctx.session.age;
                ctx.session.editing = true
                await AppDataSource.manager.save(user)
                ctx.session.step = "searchProfiles"
                ctx.reply("Анкета успешно создана!")
                //Тут будет начинаться поиск
              }
            break;

        default:
          await ctx.reply("Я не понял. Напиши /start, чтобы начать заново.");
      }
    });


    bot.catch((err) => {
      const ctx = err.ctx;
      console.log(`Error while handling update ${ctx.update.update_id}`);
      const e = err.error;

      if (e instanceof GrammyError) {
        console.log("Error in request:", e.description);
      } else if (e instanceof HttpError) {
        console.log("Error in request", e);
      } else {
        console.log("Error undefined", e);
      }
    });

    bot.start();
  })
  .catch((error) => console.log(error));
