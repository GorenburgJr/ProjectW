import { Bot as GrammyBot, GrammyError, HttpError, Context, session, SessionFlavor } from "grammy";
import * as dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";
import { User } from "./src/entity/User";
import { extraInfo } from "./src/entity/ExtraInfo";
import { checkUserExist } from './util/existCheck'
import {bioKeyboard1, bioKeyboard2, yesNoKeyboard, sexKeyboard, shareLocation, mainInfoKeyboard, settingsBioKeyboard1, settingsBioKeyboard2} from './util/keyboards'
import { CALLBACK } from "./util/callBackQuery";
import {imgUser, msgUser} from './util/userProfile'
import { Location } from "./src/entity/Location";
import { downloadingUserPhoto } from "./util/photoDownloading";
import { msgSearch } from "./util/search";
import { UserImages } from "./src/entity/UserImages";
import { SearchSettings } from "./src/entity/SearchSetting";
import { downloadingUserLocations } from "./util/locationDownloading";
import { userRegistration } from "./util/userRegistration";
dotenv.config();

interface FormSession {
  step: "askConsent" | "askName" | "askAge" | 'askSex'| 'askSexSearch'| 'askPhotos' | 'askLocation' | "extraInfo"  |null;
  chatId?: string;
  name?: string;
  age?: number;
  sex?: boolean;
  editing?: boolean;
  sexSearch?: boolean;
  editingComponent?: 'language' | 'zodiac' | 'height' | 'persType' | 'mySearch' | 'education' | 
                      'familyPlans' | 'bio' | 'work' | 'pets' | 'alcohol' | 'smoke' | 'gym' |
                      'food' | 'socmedia' | 'nightlive' | 'lovelang' | 'commtype' | 'location' | 'mainInfo' | 'name'| 'age'| 
                      'sex'| 'searchsex' | 'photos' | 'location'| 'searchStatus' |null;

  settingComponent?: 'language' | 'zodiac' | 'height' | 'persType' | 'mySearch' | 'education' | 
                      'familyPlans' | 'bio' | 'work' | 'pets' | 'alcohol' | 'smoke' | 'gym' |
                      'food' | 'socmedia' | 'nightlive' | 'lovelang' | 'commtype' | 'searchStatus' |'radius '| 'age'| null;
}

type MyContext = Context & SessionFlavor<FormSession>;

const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN as string);



AppDataSource.initialize()
  .then(async () => {
    bot.use(
      session({
        initial: (): FormSession => ({ step: null  }),
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
    })

    bot.command('edit', async (ctx) => {
      const chatId = String(ctx.chat.id)
      let user = await userRepo.findOneBy({ chatId })
      if(!user.regPassed ){
        ctx.reply('Вначале закончи регистрацию!')
        return
      }
      await userRepo.update({ chatId }, { inSearch: false })
      ctx.session.editing = true  
      await imgUser(ctx)
        ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
        })
    })

    bot.command('search', async (ctx) => {
      const chatId = String(ctx.chat.id)
      let user = await userRepo.findOneBy({ chatId })
      if(user === null || !user.regPassed){
        ctx.reply('Закончите регистрацию')
        return
      } else {
        await userRepo.update({ chatId }, { inSearch: true })
        ctx.reply(await msgSearch(ctx),{reply_markup: settingsBioKeyboard1})
      }
    })

    bot.on('callback_query', async (ctx) => {
        const chatId = String(ctx.chat.id)
        let user = await userRepo.findOneBy({ chatId })
        if(ctx.session.editing === true){
            const extraInfRepo = AppDataSource.getRepository(extraInfo);
            let user = await AppDataSource.manager.findOneBy(User, { chatId })
            let extra = await extraInfRepo.findOneBy({ chatId })
            

            if (!extra) {
              const extra = new Location();
              extra.chatId = user.chatId
              extra.user = user;
              await extraInfRepo.save(extra)
            }
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
      if(ctx.session.step === 'askPhotos' || ctx.session.editingComponent === 'photos'){
        ctx.reply("Отпрвавь мне фото")
        return
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
          await extraInfoRepo.update({ chatId }, { languages: ctx.message.text })
          await imgUser(ctx)
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
          await extraInfoRepo.update({ chatId }, { height: Number(ctx.message.text) })
          await imgUser(ctx)
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
          await imgUser(ctx)
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
          await imgUser(ctx)
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
          await imgUser(ctx)
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard2
          })
          ctx.session.editingComponent = undefined
          return
        }
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
