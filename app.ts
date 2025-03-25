import { Bot as GrammyBot, GrammyError, HttpError, Context, session, SessionFlavor } from "grammy";
import * as dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";
import { User } from "./src/entity/User";
import { extraInfo } from "./src/entity/ExtraInfo";
import { checkUserExist } from './util/existCheck'
import {bioKeyboard1, bioKeyboard2, yesNoKeyboard, sexKeyboard, shareLocation} from './util/keyboards'
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
  editingComponent?: 'language' | 'zodiac' | 'height' | 'persType' | 'search' | 'education' | 'kids' | 'bio' | 'work' | 'pets' 
  | 'alcohol' | 'smoke' | 'gym' | 'food' | 'socMedia' | 'nightLive' | 'lovelang' | 'commStyle' | 'location' |null;
  editingProf: {
    status:boolean;
    languagesStatus?: string;
    zodiacStatus?: number;
    heightStatus?: number;
    persTypeStatus?: number;
    searchStatus?: number;
    educationStatus?: number;
    kidsStatus?: number;
    bioStatus?: string
    workStatus?: string;
    petsStatus?: string;
    alcoholStatus?: number;
    smokeStatus?: number;
    gymStatus?: number;
    foodStatus?: number;
    socMediaStatus?: number;
    nightLiveStatus?: number;
  }
}

type MyContext = Context & SessionFlavor<FormSession>;

const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN as string);



AppDataSource.initialize()
  .then(async () => {
    bot.use(
      session({
        initial: (): FormSession => ({ step: "askConsent" , editingProf: { status: false} }),
      })
    );

    const extraInfoRepo = AppDataSource.getRepository(extraInfo)
    bot.command("start", async (ctx) => {
        const editingProf = { status: false }
        const chatId = String(ctx.chat.id);
        if (await checkUserExist(ctx) === false) {
            ctx.session = { step: "askConsent", chatId ,editingComponent: null, editingProf };
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
            let key = false;
            (comp === 'language')? await extraInfoRepo.update({ chatId }, { languages: null }) : void 0;
            (comp === 'zodiac')? await extraInfoRepo.update({ chatId }, { zodiacsign: null }) : void 0;
            (comp === 'height')? await extraInfoRepo.update({ chatId }, { height: null }) : void 0;
            (comp === 'persType')? await extraInfoRepo.update({ chatId }, { perstype: null }) : void 0;
            (comp === 'search')? await extraInfoRepo.update({ chatId }, { mysearch: null }) : void 0;
            (comp === 'education')? await extraInfoRepo.update({ chatId }, { education: null }) : void 0;
            (comp === 'kids')? await extraInfoRepo.update({ chatId }, { kidswish: null }) : void 0;
            (comp === 'bio')? await extraInfoRepo.update({ chatId }, { text: null }) : void 0;
            (comp === 'commStyle')? await extraInfoRepo.update({ chatId }, { commstyle: null }) : void 0;
            (comp === 'lovelang')? (await extraInfoRepo.update({ chatId }, { lovelang: null }), key = true) : void 0;
            (comp === 'work')? (await extraInfoRepo.update({ chatId }, { work: null }), key = true) : void 0;
            (comp === 'pets')? (await extraInfoRepo.update({ chatId }, { pets: null }), key = true) : void 0;
            (comp === 'alcohol')? (await extraInfoRepo.update({ chatId }, { alcohol: null }), key = true) : void 0;
            (comp === 'smoke')? (await extraInfoRepo.update({ chatId }, { smoke: null }), key = true) : void 0;
            (comp === 'gym')? (await extraInfoRepo.update({ chatId }, { gym: null }), key = true) : void 0;
            (comp === 'food')? (await extraInfoRepo.update({ chatId }, { food: null }), key = true) : void 0;
            (comp === 'socMedia')?(await extraInfoRepo.update({ chatId }, { socmedia: null }), key = true) : void 0;
            (comp === 'nightLive')? (await extraInfoRepo.update({ chatId }, { nightlive: null }), key = true) : void 0;
            ctx.deleteMessage()
            if(key){
              ctx.reply(await msgUser(ctx), {
                reply_markup: bioKeyboard2
              })
            } else {
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

      const text = ctx.message.text.trim();
      const chatId = String(ctx.chat.id);
      let user = await AppDataSource.manager.findOneBy(User, { chatId });
      if (!user) {
        user = new User();
        user.chatId = chatId;
      }
        const extra = new extraInfo()
        extra.chatId = user.chatId
        extra.user = user

      if(ctx.session.editing === true){
        if(ctx.session.editingComponent === 'language'){
          
          if(ctx.message.text.length > 35 ){
            ctx.reply('Напиши короче')
            return
          }
          ctx.deleteMessage()
          ctx.session.editingProf.languagesStatus = ctx.message.text
          extra.languages = ctx.message.text
          await extraInfoRepo.update({ chatId }, { languages: ctx.message.text })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
          })
          
          ctx.session.editingComponent = undefined
          return void 0;
        }
        if(ctx.session.editingComponent === 'height'){
          if(isNaN(Number(ctx.message.text))){
            ctx.reply("Напиши цифру")
            return
          }
          ctx.deleteMessage()
          ctx.session.editingProf.heightStatus = Number(ctx.message.text)
          extra.height = Number(ctx.message.text)
          await extraInfoRepo.update({ chatId }, { height: Number(ctx.message.text) })
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
          })
          ctx.session.editingComponent = undefined
          return void 0
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
          ctx.session.name = text
          if (ctx.session.name.length >= 25){
            await ctx.reply('Имя слишком длинное')
            return
          }
          ctx.session.step = "askAge"
          await ctx.reply("Теперь напиши возраст:")
          break;
        case "askAge":
          const age = Number(text)
          if (isNaN(age)) {
            await ctx.reply("Напиши цифру.")
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
            (text=='👕')?ctx.session.sex = true: void 0;
            (text == '👚')?ctx.session.sex = false: void 0;
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
            ctx.session.step = 'askLocation'
            ctx.reply('Отправь свое местоположение', {reply_markup: shareLocation})
          }
          break;
        case "extraInfo":
            if (text.toLowerCase() === "да") {
                ctx.react('🔥')
                ctx.session.step = "extraInfo";
                await ctx.reply("Отлично! Давай продолжим!");
                user.name = ctx.session.name;
                user.age = ctx.session.age;
                user.sex = ctx.session.sex;
                user.sexSearch = ctx.session.sexSearch;
                user.regPassed = true;
                await AppDataSource.manager.save(user)
                ctx.session.step = null
                ctx.reply(await msgUser(ctx), {
                    reply_markup: bioKeyboard1
                })
                ctx.session.editing = true
              } else {
                ctx.reply("Хорошо. Как нибудь в другой раз!")
                user.name = ctx.session.name;
                user.age = ctx.session.age;
                user.sex = ctx.session.sex;
                user.sexSearch = ctx.session.sexSearch;
                user.regPassed = true;
                ctx.session.editing = false
                await AppDataSource.manager.save(user)
                ctx.session.step = "searchProfiles"
                ctx.reply("Анкета успешно создана!")
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
