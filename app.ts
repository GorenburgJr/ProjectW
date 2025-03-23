import { Bot as GrammyBot, GrammyError, HttpError } from "grammy";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import * as dotenv from 'dotenv'

dotenv.config()

const bot = new GrammyBot(process.env.BOT_API_TOKEN as string)

bot.api.setMyCommands([

])
bot.command('start', (ctx) => { //регистрация
    ctx.reply('im working')
})

bot.command('profile', (ctx) => {//профиль

})


bot.command('help', (ctx) => {

})

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

bot.start()