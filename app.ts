import { Bot as GrammyBot, GrammyError, HttpError, Context, session, SessionFlavor } from "grammy";
import * as dotenv from "dotenv";
import { AppDataSource } from "./src/data-source";
import { User } from "./src/entity/User";
import { ExtraInfo } from "./src/entity/ExtraInfo";
import {bioKeyboard1, bioKeyboard2, yesNoKeyboard, mainInfoKeyboard, settingsBioKeyboard1} from './util/keyboards'
import { CALLBACK } from "./util/callBackQuery";
import { imgUser, msgUser} from './common/userProfile'
import { imgMatchUser, msgMatchUser } from './common/matchedUserProfile'
import { downloadingUserPhoto } from "./util/workWithPhoto";
import { msgSearch } from "./common/userSearchProfile";
import { downloadingUserLocations } from "./util/workWithLocation";
import { userRegistration } from "./common/userRegistration";
import { checkUserExist } from "./util/existCheck";
import { sendLetter } from "./util/writeLetter";
import { searchComponent } from "./util/searchComponent";
import { editComponent } from "./util/editComponent";
import { Roles } from "./src/entity/Roles"
import { checkReport } from "./admin/checkReports";
import { banReport } from "./admin/banReport";
import { BanList } from "./src/entity/BanList";
dotenv.config();

interface FormSession {
  activeStepName: "askConsent" | "askName" | "askAge" | 'askSex'| 'askSexSearch'| 'askPhotos' | 'askLocation' | "ExtraInfo"  |null;
  editingComponent?: null | 'mainInfo' | 'name' | 'age' | 'sex' | 'sexSearch' | 'location' | 'photo' | 'language' | 'zodiac' | 
  'education' | 'familyPlans' | 'persType' | 'commType' | 'loveLang' | 'bio' | 'height' | 'mySearch' | 'work' | 'pets' | 'alcohol' 
  | 'smoke' | 'gym' | 'food' | 'socMedia' | 'nightLive'
  name?: string;
  age?: number;
  sex?: boolean;
  sexSearch?: boolean;
  binary: 0; // для написания диапазона
  letter?: boolean;
  report?: boolean;
  reason?: boolean;// причина бана
  searchSettingComponent?: null |  'age' | 'radius' | 'language' | 'zodiac' | 'height' | 
  'persType' | 'mySearch' |'education' | 'familyPlans' | 'bio' | 'loveLang' | 'work' | 
  'pets' | 'alcohol' | 'smoke' | 'gym' | 'food' | 'socMedia' | 'commType' | 'nightLive'
}


type MyContext = Context & SessionFlavor<FormSession>;

export const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN);

export async function sendMatch (chatId, userChatId) {
  const user = await AppDataSource.manager.findOneBy(User, {chatId:userChatId})
  await bot.api.sendMessage(chatId, `У вас взаимная симпатия с [${user.name}](t.me/${user.userName})`, {
                      parse_mode: 'MarkdownV2',
                      disableWebPagePreview: true
} as any)
  await imgMatchUser(chatId)
  bot.api.sendMessage(chatId,await msgMatchUser(chatId))
}

AppDataSource.initialize()
  .then(async () => {
    bot.use(
      session({
        initial: (): FormSession => ({ activeStepName: null  , binary: 0}),
      })
    );
    bot.api.setMyCommands([
      {
          command:  'start', 
          description: 'Начать взаимодействие'
      },
      {
          command: 'help',
          description: 'Помощь'
      },
      {
          command: 'edit',
          description: 'Настроить свой профиль'
      },
      {
        command: 'search',
        description: 'Начать поиск'
      },
      {
        command: 'stop',
        description: 'Отключить анкету'
      }
  ])

    const userRepo = AppDataSource.getRepository(User)
    const extraInfRepo = AppDataSource.getRepository(ExtraInfo);

    bot.command("start", async (ctx) => {
        const userExist = await checkUserExist(ctx)
        const checkBan = await AppDataSource.manager.findOneBy(BanList, {bannedId: String(ctx.chat.id)})
        if(checkBan){
          ctx.reply('Вы были забанены')
          return
        }
        if (!userExist) {
            ctx.session = { activeStepName: "askConsent",editingComponent: null, binary: 0};
            await ctx.reply("Привет! Твоя анкета не была найдена. Давай создадим её (Да/Нет)",{reply_markup: yesNoKeyboard} );
        } else {
            ctx.session.activeStepName = null
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
      await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
    })

    bot.command('stop',async (ctx) => {
      const chatId = String(ctx.chat.id)
      ctx.reply('Твою анкету теперь не видно')
      await userRepo.update({chatId}, {inSearch: false})
      await imgUser(ctx, await msgUser(ctx), mainInfoKeyboard)
    })

    bot.command('search', async (ctx) => {
      const chatId = String(ctx.chat.id)
      let user = await userRepo.findOneBy({ chatId })

      if(user === null || !user.regPassed){
        ctx.reply('Вначале закончи регистрацию!\n/start')
        return
      } else {
        await userRepo.update({ chatId }, { inSearch: true })
        ctx.reply(await msgSearch(ctx),{reply_markup: settingsBioKeyboard1})
      }
    })

    bot.command('reportpanel', async (ctx) => {
      const chatId = String(ctx.chat.id)
      const checkAdmin = await AppDataSource.manager.findOneBy(Roles, { chatId })
      if(checkAdmin){
        await checkReport(ctx)
        return 
      }
      else {
        ctx.reply('Я не понял. \nНапиши /help')
        return
      }
    })

    bot.on('callback_query', async (ctx) => {
        const chatId = String(ctx.chat.id)
        let user = await userRepo.findOneBy({ chatId })
        let extra = await extraInfRepo.findOneBy({ chatId })
        
        if (!extra) {
          const extra = new ExtraInfo(user.chatId, user)
          await extraInfRepo.save(extra) 
        }

        ctx.answerCallbackQuery('Секундочку!')
        await CALLBACK(ctx)
        
    })
    
    bot.on('message:photo', async (ctx) => {await downloadingUserPhoto(ctx)})

    bot.on("message:text", async (ctx) => {
      const chatId = String(ctx.chat.id);
      if(ctx.session.activeStepName === 'askLocation' || ctx.session.editingComponent === 'location'){
        ctx.reply("Отпрвавь мне Гео")
        return
      }

      if(ctx.session.activeStepName === 'askPhotos' || ctx.session.editingComponent === 'photo'){
        ctx.reply("Отпрвавь мне фото")
        return
      }

      if(ctx.session.activeStepName !== null){
        await userRegistration(ctx)
        return
      }

      if(ctx.session.letter === true){
        sendLetter(ctx)
        return
      }
      
      const checkBan = await AppDataSource.manager.findOneBy(BanList, {bannedId: String(ctx.chat.id)})
      if(checkBan){
        ctx.reply('Вы были забанены')
        return
      }

      let user = await userRepo.findOneBy({ chatId });
      ctx.message.text = ctx.message.text.trim();

      if(ctx.session.reason === true){
        await banReport(user ,ctx)
        ctx.session.reason = undefined
        ctx.reply('Сохранено')
        return ctx
      }

      if (!user) {
        user = new User(chatId);
        user.chatId = chatId;
      }

      if (ctx.session.searchSettingComponent !== null ||ctx.session.searchSettingComponent !== undefined){
        searchComponent(ctx)
        return
      }
      
      if (ctx.session.editingComponent !== null ||ctx.session.editingComponent !== undefined){
        editComponent(ctx)
        return
      }

      if(ctx.session.editingComponent !== null){
      ctx.session.editingComponent = null;
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
