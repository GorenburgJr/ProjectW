import { Bot as GrammyBot, GrammyError, HttpError, Context, session, SessionFlavor } from "grammy";
import * as dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";
import { User } from "./src/entity/User";
import { extraInfo } from "./src/entity/ExtraInfo";
import { checkUserExist } from './util/existCheck'
import {bioKeyboard1, bioKeyboard2, yesNoKeyboard, sexKeyboard, shareLocation, mainInfoKeyboard} from './util/keyboards'
import { CALLBACK } from "./util/callBackQuery";
import {msgUser} from './util/userProfile'
import { Location } from "./src/entity/Location";
dotenv.config();

interface FormSession {
  step: "askConsent" | "askName" | "askAge" | "extraInfo" | 'askLocation' | 'askSex'| 'askSexSearch' | 'searchProfiles' |null;
  chatId?: string;
  name?: string;
  age?: number;
  sex?: boolean;
  editing?: boolean;
  sexSearch?: boolean;
  editingComponent?: 'language' | 'zodiac' | 'height' | 'persType' | 'search' | 'education' | 'familyPlans' | 'bio' | 'work' | 'pets' 
  | 'alco' | 'smoke' | 'gym' | 'food' | 'socMedia' | 'nightLive' | 'lovelang' | 'commType' | 'location' | 'mainInfo' | 'name'| 'age'| 'sex'| 'searchsex' | 'location' | 'searchStatus' |null;
}

type MyContext = Context & SessionFlavor<FormSession>;

const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN as string);



AppDataSource.initialize()
  .then(async () => {
    bot.use(
      session({
        initial: (): FormSession => ({ step: "askConsent"  }),
      })
    );
    const userRepo = AppDataSource.getRepository(User)
    const extraInfoRepo = AppDataSource.getRepository(extraInfo)
    bot.command("start", async (ctx) => {
        const chatId = String(ctx.chat.id);
        if (await checkUserExist(ctx) === false) {
            ctx.session = { step: "askConsent", chatId ,editingComponent: null};
            await ctx.reply("Привет! Твоя анкета не была найдена. Давай создадим её (Да/Нет)",{reply_markup: yesNoKeyboard} );
        } else {
            ctx.session.step = null
            await ctx.reply("У вас уже пройдена регистрация.\n\nЕсли вы желаете изменить анкету, наберите\n /edit\n \nЕсли хотите продолжить поиск наберитe\n /search");
        }
    });

    bot.command('edit', async (ctx) => {
        ctx.session.editing = true
        const chatId = String(ctx.chat.id)
        ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
        })
    })
    bot.on('callback_query', async (ctx) => {
        const chatId = String(ctx.chat.id)
        if(ctx.session.editing === true){
            let user = await AppDataSource.manager.findOneBy(User, { chatId })
            const extraInfRepo = AppDataSource.getRepository(extraInfo);
            let extra = await extraInfRepo.findOneBy({ chatId })

            if (!extra) {
              const extra = new Location();
              extra.chatId = user.chatId
              extra.user = user;
              await extraInfRepo.save(extra)
            }

          if(ctx.callbackQuery.data === 'delete'){
            const comp = ctx.session.editingComponent;
            let key = 0;
            (comp === 'language')? (await extraInfoRepo.update({ chatId }, { languages: null }),key = 3) : void 0;
            (comp === 'zodiac')? await extraInfoRepo.update({ chatId }, { zodiacsign: null }) : void 0;
            (comp === 'height')?  (await extraInfoRepo.update({ chatId }, { height: null }),key = 3) : void 0;
            (comp === 'persType')? await extraInfoRepo.update({ chatId }, { perstype: null }) : void 0;
            (comp === 'search')? await extraInfoRepo.update({ chatId }, { mysearch: null }) : void 0;
            (comp === 'education')? await extraInfoRepo.update({ chatId }, { education: null }) : void 0;
            (comp === 'familyPlans')? await extraInfoRepo.update({ chatId }, { familyplans: null }) : void 0;
            (comp === 'bio')? await extraInfoRepo.update({ chatId }, { text: null }) : void 0;
            (comp === 'commType')? await extraInfoRepo.update({ chatId }, { commtype: null }) : void 0;
            (comp === 'lovelang')? (await extraInfoRepo.update({ chatId }, { lovelang: null }), key = 1) : void 0;
            (comp === 'work')? (await extraInfoRepo.update({ chatId }, { work: null }), key = 1) : void 0;
            (comp === 'pets')? (await extraInfoRepo.update({ chatId }, { pets: null }), key = 1) : void 0;
            (comp === 'alco')? (await extraInfoRepo.update({ chatId }, { alcohol: null }), key = 1) : void 0;
            (comp === 'smoke')? (await extraInfoRepo.update({ chatId }, { smoke: null }), key = 1) : void 0;
            (comp === 'gym')? (await extraInfoRepo.update({ chatId }, { gym: null }), key = 1) : void 0;
            (comp === 'food')? (await extraInfoRepo.update({ chatId }, { food: null }), key = 1) : void 0;
            (comp === 'socMedia')?(await extraInfoRepo.update({ chatId }, { socmedia: null }), key = 1) : void 0;
            (comp === 'nightLive')? (await extraInfoRepo.update({ chatId }, { nightlive: null }), key = 1) : void 0;
            (comp === 'searchStatus')? (await AppDataSource.getRepository(User).delete({ chatId: '392290570' }), key = 1,ctx.reply("Чтобы создать анкету - напиши\n /start"), user = undefined) : void 0;
            if(key == 0){
              ctx.editMessageText(await msgUser(ctx), {
                reply_markup: bioKeyboard1
              })
            } else if (key == 1){
              ctx.editMessageText(await msgUser(ctx), {
                reply_markup: bioKeyboard2
              })
            } else {
              ctx.deleteMessage()
              ctx.reply(await msgUser(ctx), {
                reply_markup: bioKeyboard1
              })
            }
            ctx.session.editingComponent = null
          }
            ctx.answerCallbackQuery('Уже работаю!')
            await CALLBACK(ctx)
        }
    })
    
    
    bot.on("message:text", async (ctx) => {
      if(ctx.session.step === 'askLocation' || ctx.session.editingComponent === 'location'){
        ctx.reply("Отпрвавь мне Гео")
      }
      const chatId = String(ctx.chat.id);
      let user = await AppDataSource.manager.findOneBy(User, { chatId });
      const text = ctx.message.text.trim();
      
      if (!user) {
        user = new User();
        user.chatId = chatId;
      }

      const extra = new extraInfo()
      extra.chatId = user.chatId
      extra.user = user

      if(ctx.session.editing === true){
        await userRepo.update({ chatId }, { inSearch: false })
        if(ctx.session.editingComponent === 'language'){
          if(ctx.message.text.length > 35 ){
            ctx.reply('Напиши короче')
            return
          }
          ctx.deleteMessage()
          await extraInfoRepo.update({ chatId }, { languages: ctx.message.text })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
          })
          ctx.session.editingComponent = undefined
          return;
        }
        if(ctx.session.editingComponent === 'height'){
          if(isNaN(Number(ctx.message.text))){
            ctx.reply("Напиши цифру")
            return
          }
          ctx.deleteMessage()
          await extraInfoRepo.update({ chatId }, { height: Number(ctx.message.text) })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
          })
          ctx.session.editingComponent = undefined
          return
        }
        if(ctx.session.editingComponent === 'bio'){
          if(ctx.message.text.length> 500){
            ctx.reply('Напиши короче')
            return
          }
          await extraInfoRepo.update({ chatId }, { text: ctx.message.text })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
          })
          ctx.session.editingComponent = undefined
          return;
        }
        if(ctx.session.editingComponent === 'pets'){
          if(ctx.message.text.length> 35){
            ctx.reply('Напиши короче')
            return
          }
          await extraInfoRepo.update({ chatId }, { pets: ctx.message.text })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard2
          })
          ctx.session.editingComponent = undefined
          return
        }
        if(ctx.session.editingComponent === 'work'){
          if(ctx.message.text.length> 35){
            ctx.reply('Напиши короче')
            return
          }
          await extraInfoRepo.update({ chatId }, { work: ctx.message.text })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard2
          })
          ctx.session.editingComponent = undefined
          return
        }
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
          if (text.length >= 25){
            await ctx.reply('Имя слишком длинное')
          }
          if(ctx.session.editing){
            await userRepo.update({ chatId }, { name: text })
            ctx.session.step = null;
            ctx.reply(await msgUser(ctx), {reply_markup:mainInfoKeyboard})
            return
          }
          ctx.session.name = text
          ctx.session.step = "askAge"
          await ctx.reply("Теперь напиши возраст:")
          break;
        case "askAge":
          const age = Number(text)
          if (isNaN(age)) {
            await ctx.reply("Напиши цифру.")
            return
          }
          if(ctx.session.editing){
            await userRepo.update({ chatId }, { age: Number(text) })
            ctx.session.step = null;
            ctx.reply(await msgUser(ctx), {reply_markup:mainInfoKeyboard})
            return
          }
          ctx.session.age = age
          ctx.session.step = "askSex"
          await ctx.reply("Выбери Пол", {reply_markup: sexKeyboard})
          break;
        case "askSex":
          if(text != '👚' && text != '👕'){
            ctx.reply('Просто выбери',{reply_markup: sexKeyboard})
            return
          } else {
            if (text=='👕'){ctx.session.sex = true}
            if(text == '👚'){ctx.session.sex = false}
            if(ctx.session.editing){
              await userRepo.update({ chatId }, { sex: ctx.session.sex })
              ctx.session.step = null;
              ctx.reply(await msgUser(ctx), {reply_markup:mainInfoKeyboard})
              return
            }
            ctx.session.step = 'askSexSearch'
            ctx.reply('Кто Тебе интересен?',{reply_markup: sexKeyboard})
          }
          break;
        case 'askSexSearch':
          if(text != '👚' && text != '👕'){
            ctx.reply('Просто выбери',{reply_markup: sexKeyboard})
            return
          } else {
            (text=='👕')?ctx.session.sexSearch = true: void 0;
            (text == '👚')?ctx.session.sexSearch = false: void 0;
            if(ctx.session.editing){
              await userRepo.update({ chatId }, { sexSearch: ctx.session.sexSearch })
              ctx.session.step = null;
              ctx.reply(await msgUser(ctx), {reply_markup:mainInfoKeyboard})
              return
            }
            ctx.session.step = 'askLocation'
            user.name = ctx.session.name;
            user.age = ctx.session.age;
            user.sex = ctx.session.sex;
            user.sexSearch = ctx.session.sexSearch;
            await AppDataSource.manager.save(user)
            ctx.reply('Отправь свое местоположение', {reply_markup: shareLocation})
          }
          break;
        case "extraInfo":
            if (text.toLowerCase() === "да") {
                ctx.react('🔥')
                ctx.session.step = "extraInfo";
                await ctx.reply("Отлично! Давай продолжим!");
                await userRepo.update({ chatId }, { inSearch: true })
                ctx.session.step = null
                ctx.reply(await msgUser(ctx), {
                    reply_markup: bioKeyboard1
                })
                ctx.session.editing = true
              } else {
                await userRepo.update({ chatId }, { inSearch: true })
                ctx.session.editing = false
                ctx.session.step = "searchProfiles"
                ctx.reply("Анкета успешно создана!\nХорошо. Как нибудь в другой раз!")
                //Тут будет начинаться поиск
              }
            break;

        default:
          await ctx.reply("Я не понял. Напиши /start");
      }
    });

    bot.on(':location', async (ctx) => {
      const chatId = String(ctx.chat.id)
      const { latitude, longitude } = ctx.message.location
      if(ctx.session.step == 'askLocation' || ctx.session.editingComponent == 'location'){
        const user = await AppDataSource.getRepository(User).findOneBy({ chatId });
        const locationRepo = AppDataSource.getRepository(Location);

        let location = await locationRepo.findOneBy({ chatId });

          if (!location) {
            location = new Location();
              location.chatId = chatId;
              location.user = user;
          }

        location.location = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
        if(ctx.session.editing && ctx.session.editingComponent === 'mainInfo'){
          await locationRepo.update({ chatId }, { location : {
            type: "Point",
            coordinates: [longitude, latitude]}})
            ctx.reply(await msgUser(ctx), {reply_markup:mainInfoKeyboard})
            ctx.session.step = null
            return
        }
        await locationRepo.save(location);
        await ctx.reply("Локация сохранена! 📍");
        (ctx.session.step == 'askLocation')?(ctx.session.step = 'extraInfo', await ctx.reply('Хочешь еще что то о себе написать?',{reply_markup: yesNoKeyboard})): void 0;
        (ctx.session.editingComponent == 'location')?(ctx.session.editingComponent = null, ctx.reply(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
      }else {
        ctx.reply('Зачем мне метка')
      }
    })

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
