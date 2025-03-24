import { Bot as GrammyBot , InlineKeyboard } from 'grammy'
import * as dotenv from "dotenv";
import { bioKeyboard1, bioKeyboard2 } from './keyboards';
import{AppDataSource} from '../src/data-source'
import { User } from '../src/entity/User';
dotenv.config()
const bot = new GrammyBot(process.env.BOT_API_TOKEN as string)


async function CALLBACK (ctx) {
    const chatId = String(ctx.chat.id)
    const data = ctx.callbackQuery.data;
    //таблица выбора
    
    (data === 'languges') ? true: void 0;
    
   (data === 'zodiac_sigh') ? true : void 0;

   (data === 'height') ? true : void 0;
    
   (data === 'pers_type') ? true : void 0;
    
   (data === 'my_search') ? true : void 0;
    
   (data === 'education') ? true : void 0;
    
   (data === 'kids_wish') ? true : void 0;
    
   (data === 'bio') ? true : void 0;
    
   (data === 'comm_type') ? true : void 0;

    // вторая часть
   (data === 'love_lang') ? true : void 0;
    
   (data === 'myWork') ? true : void 0;
    
   (data === 'myPets') ? true : void 0;
    
   (data === 'attituAlco') ? true : void 0;
    
   (data === 'attituSmoke') ? true : void 0;
    
   (data === 'attitudeGym') ? true : void 0;
    
   (data === 'atitudeFood') ? true : void 0;
    
   (data === 'mySocMedia') ? true : void 0;
    
   (data === 'myNightLive') ? true : void 0;
    // навигация по разделам
   (data === 'forward') ?  (ctx.editMessageText(`${ctx.from.first_name}, Твой профиль сейчас выглядит так: ${(await AppDataSource.manager.findOneBy(User, { chatId })).name}, ${(await AppDataSource.manager.findOneBy(User, { chatId })).age}`, {
    reply_markup: bioKeyboard2
}))    : void 0;
    
   (data === 'backward') ?  (ctx.editMessageText(`${ctx.from.first_name}, Твой профиль сейчас выглядит так: ${(await AppDataSource.manager.findOneBy(User, { chatId })).name}, ${(await AppDataSource.manager.findOneBy(User, { chatId })).age}`, {
    reply_markup: bioKeyboard1
}))  : void 0;
    
   (data === 'quit_editing') ? true : void 0;
    //Знак зодиака
   (data === 'capricorn') ? true : void 0;
    
   (data === 'aquarius') ? true : void 0;
    
   (data === 'pisces') ? true : void 0;
    
   (data === 'aries') ? true : void 0;
    
   (data === 'taurus') ? true : void 0;
    
   (data === 'gemini') ? true : void 0;
    
   (data === 'cancer') ? true : void 0;
    
   (data === 'lion') ? true : void 0;
    
   (data === 'virgo') ? true : void 0;
    
   (data === 'libra') ? true : void 0;
    
   (data === 'scorpio') ? true : void 0;
    
   (data === 'sagittarius') ? true : void 0;
    //Тип личности
   (data === 'intj') ? true : void 0;
    
   (data === 'intp') ? true : void 0;
    
   (data === 'entj') ? true : void 0;
    
   (data === 'entp') ? true : void 0;
    
   (data === 'infj') ? true : void 0;
    
   (data === 'infp') ? true : void 0;
    
   (data === 'enfj') ? true : void 0;
    
   (data === 'enfp') ? true : void 0;
    
   (data === 'istj') ? true : void 0;
    
   (data === 'isfj') ? true : void 0;
    
   (data === 'estj') ? true : void 0;
    
   (data === 'esfj') ? true : void 0;
    
   (data === 'istp') ? true : void 0;
    
   (data === 'isfp') ? true : void 0;
    
   (data === 'estp') ? true : void 0;

   (data === 'esfp') ? true : void 0;
    //кого ищешь
   (data === 'justFun') ? true : void 0;
    
   (data === 'findFriend') ? true : void 0;
    
   (data === 'thinking') ? true : void 0;
    
   (data === 'longTermPartner') ? true : void 0;
    
   (data === 'termLove') ? true : void 0;
    
   (data === 'termDrink') ? true : void 0;
    //Образование
   (data === 'bachelors') ? true : void 0;
    
   (data === 'college') ? true : void 0;
    
   (data === 'school') ? true : void 0;
    
   (data === 'science') ? true : void 0;
    
   (data === 'postgraduate') ? true : void 0;
    
   (data === 'Masters') ? true : void 0;
    //Дети
   (data === 'wantKids') ? true : void 0;
    
   (data === 'noWantKids') ? true : void 0;
    
   (data === 'haveNwantKids') ? true : void 0;
    
   (data === 'haveNnowantKids') ? true : void 0;
    
   (data === 'idkKids') ? true : void 0;
    //Стиль общения
   (data === 'talkChating') ? true : void 0;
    
   (data === 'talkPhone') ? true : void 0;
    
   (data === 'talkVideo') ? true : void 0;
    
   (data === 'talkNoChating') ? true : void 0;
    
   (data === 'talkMeet') ? true : void 0;
    //Язык любви
   (data === 'LoveLAtt') ? true : void 0;
    
   (data === 'loveLPres') ? true : void 0;
    
   (data === 'loveLTouch') ? true : void 0;
    
   (data === 'loveLComplim') ? true : void 0;
    
   (data === 'loveLTime') ? true : void 0;
    
   (data === 'back') ? true : void 0;
    
   return ctx
}

export {CALLBACK}