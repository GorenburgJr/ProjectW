import { Bot as GrammyBot, GrammyError, HttpError,  Context, session, SessionFlavor } from "grammy";

import * as dotenv from 'dotenv'

import { AppDataSource } from "./src/data-source"
import { User } from "./src/entity/User"

dotenv.config()

const bot = new GrammyBot<MyContext>(process.env.BOT_API_TOKEN as string)

interface FormSession {
    step: "askConsent" | "askName" | "askAge" | "completed" | null;
    name?: string;
    surname?: string;
  }

type MyContext = Context & SessionFlavor<FormSession>

AppDataSource.initialize().then(async () => {
const user = new User()

bot.use(
    session({
      initial: (): FormSession => ({ step: "askConsent" }),
    })
  )


bot.api.setMyCommands([

]);

bot.command('start', async (ctx) => { //регистрация
    if((await AppDataSource.manager.findOneBy(User,{chatId : String(ctx.chatId)})) == null){
        ctx.session.step = "askConsent"
        await ctx.reply("Привет! Твоя анкета не была найдена. Давай создадим её (Да/Нет)")
    } 
    else if((await AppDataSource.manager.findOneBy(User,{chatId : String(ctx.chatId)})).regPassed == false){
        ctx.session.step = "askConsent"
        await ctx.reply("Привет! Твоя анкета не была найдена. Давай создадим её (Да/Нет)")
    }
    else{
        ctx.reply('У вас уже пройдена регистрация\n \nЕсли вы желаете изменить анкету наберите /edit')
    }
    
})

bot.on("message:text", async (ctx) => {
    const text = ctx.message.text.trim().toLowerCase();

    switch (ctx.session.step) {
      case "askConsent":
        if (text === "да") {
            ctx.session.step = "askName";
            user.chatId = String(ctx.chatId)
          await ctx.reply("Отлично! Напиши своё имя:");
        } else {
          await ctx.reply("Хорошо, если передумаешь — напиши /start.");
          ctx.session.step = null;
        }
        break;
      case "askName":
        user.name = ctx.message.text;
        ctx.session.step = "askAge";
        await ctx.reply("Теперь напиши возраст:");
        break;
  
      case "askAge":
        user.age = Number(ctx.message.text);
        if(isNaN(user.age)){
            ctx.reply('Напиши цифру')
            break
        }
        user.regPassed = true
        console.log(user)
        AppDataSource.manager.save(user)
        ctx.session.step = null; // Завершаем сессию
        break;
  
      default:
        await ctx.reply("Я не понял. Напиши /start, чтобы начать заново.");
    }
    
  });

// bot.command('profile', (ctx) => {//профиль

// })

// bot.command('help', (ctx) => {

// })

bot.catch((err) => { //err
    const ctx = err.ctx
    console.log(`Error while handling update ${ctx.update.update_id}`)
    const e = err.error

    if( e instanceof GrammyError){
        console.log('Error in request:', e.description)
    }
    else if(e instanceof HttpError){
        console.log('Error in request', e)
    }
    else {
        console.log('Error undefined', e)
    }
})

}).catch(error => console.log(error))
bot.start()