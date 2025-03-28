import { Bot as GrammyBot, GrammyError, HttpError, Context, session, SessionFlavor } from "grammy";
import * as dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";
import { User } from "./src/entity/User";
import { extraInfo } from "./src/entity/ExtraInfo";
import {bioKeyboard1, bioKeyboard2, yesNoKeyboard, mainInfoKeyboard, settingsBioKeyboard1} from './util/keyboards'
import { CALLBACK } from "./util/callBackQuery";
import {imgUser, msgUser} from './common/userProfile'
import { Location } from "./src/entity/Location";
import { downloadingUserPhoto } from "./util/workWithPhoto";
import { msgSearch } from "./common/userSearchProfile";
import { SearchSettings } from "./src/entity/SearchSetting";
import { downloadingUserLocations } from "./util/workWithLocation";
import { userRegistration } from "./common/userRegistration";
import { checkUserExist } from "./util/existCheck";
import { text } from "stream/consumers";
dotenv.config();

interface FormSession {
  step: "askConsent" | "askName" | "askAge" | 'askSex'| 'askSexSearch'| 'askPhotos' | 'askLocation' | "extraInfo"  |null;
  editingComponent?: null | 'mainInfo' | 'name' | 'age' | 'sex' | 'sexSearch' | 'location' | 'photo' |'language' | 'zodiac' | 'education' | 'familyPlans' | 'persType' | 'commType' | 'loveLang' | 'bio' | 'height' | 'mySearch' | 'work' | 'pets' | 'alcohol' | 'smoke' | 'gym' | 'food' | 'socMedia' | 'nightLive'
  name?: string;
  age?: number;
  sex?: boolean;
  sexSearch?: boolean;
  binary: 0;
  settingComponent?: null |  'age' | 'radius' | 'language' | 'zodiac' | 'height' | 'persType' | 'mySearch' |'education' | 'familyPlans' | 'bio' | 'loveLang' | 'work' | 'pets' | 'alcohol' | 'smoke' | 'gym' | 'food' | 'socMedia' | 'commType' | 'nightLive'
}


type MyContext = Context & SessionFlavor<FormSession>;

const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN as string);



AppDataSource.initialize()
  .then(async () => {
    bot.use(
      session({
        initial: (): FormSession => ({ step: null  , binary: 0}),
      })
    );
    
    const userRepo = AppDataSource.getRepository(User)
    const extraInfoRepo = AppDataSource.getRepository(extraInfo)
    bot.command("start", async (ctx) => {
        const userExist = await checkUserExist(ctx)
        if (!userExist) {
            ctx.session = { step: "askConsent",editingComponent: null, binary: 0};
            await ctx.reply("Привет! Твоя анкета не была найдена. Давай создадим её (Да/Нет)",{reply_markup: yesNoKeyboard} );
        } else {
            ctx.session.step = null
            await ctx.reply("У вас уже пройдена регистрация.\n\nЕсли вы желаете изменить анкету, наберите\n /edit\n \nЕсли хотите продолжить поиск наберитe\n /search");
        }
    })

    bot.command('edit', async (ctx) => {
      const chatId = String(ctx.chat.id)
      let user = await userRepo.findOneBy({ chatId })
      if(!user || user.regPassed  == false){
        ctx.reply('Вначале закончи регистрацию!\n/start')
        return
      }
      await userRepo.update({ chatId }, { inSearch: false })  
      await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
    })

    bot.command('search', async (ctx) => {
      const chatId = String(ctx.chat.id)
      let user = await userRepo.findOneBy({ chatId })
      const existingSearchSettings = await AppDataSource.manager.findOneBy(SearchSettings, { chatId });
      if(user === null || !user.regPassed){
        ctx.reply('Вначале закончи регистрацию!\n/start')
        return

      } else {
        if(!existingSearchSettings){
        const defaultUserSearchSettings = await AppDataSource.manager.findOneBy(User, { chatId })
        await AppDataSource.manager.save(defaultUserSearchSettings)
        }

        await userRepo.update({ chatId }, { inSearch: true })
        ctx.reply(await msgSearch(ctx),{reply_markup: settingsBioKeyboard1})
      }
    })

    bot.on('callback_query', async (ctx) => {
        const chatId = String(ctx.chat.id)
        let user = await userRepo.findOneBy({ chatId })
        const extraInfRepo = AppDataSource.getRepository(extraInfo);
        let extra = await extraInfRepo.findOneBy({ chatId })
        
        if (!extra) {
          const extra = new Location();
          extra.chatId = user.chatId
          extra.user = user;
          await extraInfRepo.save(extra) 
        }

        ctx.answerCallbackQuery('Уже работаю!')
        await CALLBACK(ctx)
        
    })
    
    bot.on('message:photo', async (ctx) => {
      await downloadingUserPhoto(ctx)
      return
    })

    bot.on("message:text", async (ctx) => {
      if(ctx.session.step === 'askLocation' || ctx.session.editingComponent === 'location'){
        ctx.reply("Отпрвавь мне Гео")
        return
      }
      if(ctx.session.step === 'askPhotos' || ctx.session.editingComponent === 'photo'){
        ctx.reply("Отпрвавь мне фото")
        return
      }
      const chatId = String(ctx.chat.id);
      let user = await AppDataSource.manager.findOneBy(User, { chatId });
      const settings = await AppDataSource.manager.findOneBy(SearchSettings, { chatId })
      ctx.message.text = ctx.message.text.trim();
      const searchSettingsRepo = AppDataSource.getRepository(SearchSettings)
      
      if (!user) {
        user = new User();
        user.chatId = chatId;
      }

      const extra = new extraInfo()
      extra.chatId = user.chatId
      extra.user = user

      const maxLengths = {
        language: 35,
        pets: 35,
        work: 35,
        bio: 500,
        name: 15
      };

      switch(ctx.session.settingComponent){
        case 'height':
          const height = Number(ctx.message.text)
          if (isNaN(height)) {
            await ctx.reply('Напиши цифру');
            return;
          }
          if(ctx.session.binary == 0){
            if(!Array.isArray(settings.height)){
              settings.height = []
            }
            settings.height[ctx.session.binary] = Number(ctx.message.text)
            ctx.session.binary += 1
            ctx.reply('Напиши до какого значения')
            await searchSettingsRepo.update({ chatId }, settings)
            return ctx.session.binary
          }
          if(ctx.session.binary == 1 ){
            if(Number(ctx.message.text) < settings.age[0]){
              ctx.reply('Второе число не может быть меньше первого значения')
              return
            }
            settings.height[ctx.session.binary] = Number(ctx.message.text)
            await AppDataSource.manager.save(settings)
            ctx.session.binary = 0
            ctx.reply(await msgSearch(ctx), {reply_markup: settingsBioKeyboard1})
            ctx.session.settingComponent = null
            return ctx.session
          }
        case 'age':
          const age = Number(ctx.message.text)
          if (isNaN(age)) {
            await ctx.reply('Напиши цифру');
            return;
          }
          if(ctx.session.binary == 0){
            settings.age[ctx.session.binary] = Number(ctx.message.text)
            ctx.session.binary += 1
            ctx.reply('Напиши до какого значения')
            await AppDataSource.manager.save(settings)
            return ctx.session.binary
          }
          if(ctx.session.binary == 1 ){
            if(Number(ctx.message.text) < settings.age[0]){
              ctx.reply('Второе число не может быть меньше первого значения')
              return
            }
            settings.age[ctx.session.binary] = Number(ctx.message.text)
            await AppDataSource.manager.save(settings)
            ctx.session.binary = 0
            ctx.session.settingComponent = null
            ctx.reply(await msgSearch(ctx), {reply_markup: settingsBioKeyboard1})
            return ctx

          }
          await searchSettingsRepo.update({ chatId }, {height: [height]})
          await AppDataSource.manager.save(settings)
          return
        case 'radius':
          let radius = Number(ctx.message.text)
          if (isNaN(radius)) {
            await ctx.reply('Напиши цифру');
            return;
          }
          if(radius >150){
            ctx.reply('Ограничение на 150 КМ')
            return
          }
          radius *= 1000
          await searchSettingsRepo.update({ chatId }, {radius: radius})
          await ctx.reply(await msgSearch(ctx), {reply_markup:settingsBioKeyboard1})
          ctx.session.settingComponent = null
          return ctx
      }

      switch (ctx.session.editingComponent) {
        case 'language':
        case 'pets':
        case 'work':
        case 'bio':
          if (ctx.message.text.length > maxLengths[ctx.session.editingComponent]) {
            await ctx.reply('Напиши короче');
            return;
          }
          await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: ctx.message.text });
          await imgUser(ctx,await msgUser(ctx), ctx.session.editingComponent === 'language' ||  ctx.session.editingComponent === 'bio' ? bioKeyboard1 : bioKeyboard2);
          break;

        case 'height':
          const height = Number(ctx.message.text);
          if (isNaN(height)) {
            await ctx.reply('Напиши цифру');
            return;
          }
          await extraInfoRepo.update({ chatId }, { height });
          await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
          break;
          case 'name':
            if (ctx.message.text.length > maxLengths[ctx.session.editingComponent]) {
              await ctx.reply('Напиши короче');
              return;
            }
            await userRepo.update({ chatId }, { name: ctx.message.text })
            await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
            ctx.session.editingComponent = 'mainInfo'
            return
          case 'age':
            const age = Number(ctx.message.text);
            if (isNaN(age)) {
              await ctx.reply('Напиши цифру');
              return;
            }
            await userRepo.update({ chatId }, { age: Number(ctx.message.text) });
            await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
            ctx.session.editingComponent = 'mainInfo'
            return
          default:
            break;
        }
      if(ctx.session.editingComponent != null){
      ctx.session.editingComponent = null;
      return
      }
      if(ctx.session.step != null){
        await userRegistration(ctx)
        return
      }

        ctx.reply('Я не понял. \nНапиши /help')
    })

    bot.on(':location', async (ctx) => {await downloadingUserLocations(ctx)})

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
