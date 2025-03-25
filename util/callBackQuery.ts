import { Bot as GrammyBot , InlineKeyboard } from 'grammy'
import * as dotenv from "dotenv";
import { bioKeyboard1, bioKeyboard2, cancelBackKeyboard,zodiacKeyboard, typePersKeyboard } from './keyboards';
import{AppDataSource} from '../src/data-source'
import { User } from '../src/entity/User';
import { msgUser } from './userProfile';
import { extraInfo } from '../src/entity/ExtraInfo';
dotenv.config()
const bot = new GrammyBot(process.env.BOT_API_TOKEN as string)



async function CALLBACK (ctx) {
    const chatId = String(ctx.chat.id)
    const data = ctx.callbackQuery.data;
    const comp = ctx.session.editingComponent
    const extra = await AppDataSource.manager.findOneBy(extraInfo, { chatId });
    const extraInfoRepo = AppDataSource.getRepository(extraInfo)
    //таблица выбора
    
    if(data === 'languges'){
    ctx.reply('Напиши Языки',{
        reply_markup: cancelBackKeyboard}
    )
    ctx.session.editingComponent = 'language'
    return ctx
    }
    if(data == 'back'){
        if(ctx.session.editingComponent = 'persType'){
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})
            return
        }
        ctx.deleteMessage()
    }
    // if(ctx.callbackQuery.data == 'back' && !(ctx.session.editingComponent === 'zodiac' || 'persType' || 'search' || 'education' || 'kids' || 'alcohol' || 'smoke' || 'gym' || 'food' || 'socMedia' || 'nightLive')){
    //     ctx.editMessageText(await msgUser(ctx),{
    //         reply_markup: bioKeyboard1})
        
    // } else 
    
    if(data === 'zodiac_sigh'){
        ctx.session.editingComponent = 'zodiac'
        ctx.reply('Выбери свой ЗЗ', {
            reply_markup: zodiacKeyboard
        })
    }

    if(data === 'height'){
        ctx.reply('Напиши свой рост',{
            reply_markup: cancelBackKeyboard}
        )
        ctx.session.editingComponent = 'height'
        return ctx
    }
    
    if(data === 'pers_type'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: typePersKeyboard})
        ctx.session.editingComponent = 'persType'
        return ctx
    }
    
    if(data === 'my_search'){

    }
    
    if(data === 'education'){
    
    }
    
    if(data === 'kids_wish'){
    
    }
    
    if(data === 'bio'){
    
    }
    
    if(data === 'comm_type'){
    
    }

    // вторая часть
    if(data === 'love_lang'){
    
    }
    
    if(data === 'myWork'){
    
    }
    
    if(data === 'myPets'){
    
    }
    
    if(data === 'attituAlco'){

    }
    
    if(data === 'attituSmoke'){

    }
    
    if(data === 'attitudeGym'){

    }
    
    if(data === 'atitudeFood'){
    
    }
    
    if(data === 'mySocMedia'){

    }
    
    if(data === 'myNightLive'){
    
    }
    // навигация по разделам
    if (data === 'forward') {
        ctx.editMessageText(await msgUser(ctx),{reply_markup: bioKeyboard2})
    }
    if (data === 'backward'){
        ctx.editMessageText(await msgUser(ctx),{reply_markup: bioKeyboard1})
    }
    
    if(data === 'quit_editing'){
        ctx.reply('Анкета успешно сохранена!')
        ctx.reply('Приступим к поиску')
        ctx.session.step = "searchProfiles"
        return ctx
    }
    //Знак зодиака
    if(data === 'capricorn'){
        extra.zodiacsign = 0
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'aquarius'){
        extra.zodiacsign = 1
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'pisces'){
        extra.zodiacsign = 2
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'aries'){
        extra.zodiacsign = 3
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'taurus'){
        extra.zodiacsign = 4
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'gemini'){
        extra.zodiacsign = 5
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'cancer'){
        extra.zodiacsign = 6
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'lion'){
        extra.zodiacsign = 7
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'virgo'){
        extra.zodiacsign = 8
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'libra'){
        extra.zodiacsign = 9
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'scorpio'){
        extra.zodiacsign = 10
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    
    if(data === 'sagittarius'){
        extra.zodiacsign = 11
        await extraInfoRepo.save(extra)
        ctx.deleteMessage()
        ctx.reply(await msgUser(ctx),{reply_markup: bioKeyboard1})
        ctx.session.editingComponent = null
        return ctx
    }
    //Тип личности
if(data === 'intj'){
}
    
if(data === 'intp'){
}
    
if(data === 'entj'){
}
    
if(data === 'entp'){
}
    
if(data === 'infj'){
}
    
if(data === 'infp'){
}
    
if(data === 'enfj'){
}
    
if(data === 'enfp'){
}
    
if(data === 'istj'){
}
    
if(data === 'isfj'){
}
    
if(data === 'estj'){
}
    
if(data === 'esfj'){
}
    
if(data === 'istp'){
}
    
if(data === 'isfp'){
}
    
if(data === 'estp'){
}

if(data === 'esfp'){
}
    //кого ищешь
if(data === 'justFun'){
}
    
if(data === 'findFriend'){
}
    
if(data === 'thinking'){
}
    
if(data === 'longTermPartner'){
}
    
if(data === 'termLove'){
}
    
if(data === 'termDrink'){
}
    //Образование
if(data === 'bachelors'){
}
    
if(data === 'college'){
}
    
if(data === 'school'){
}
    
if(data === 'science'){
}
    
if(data === 'postgraduate'){
}
    
if(data === 'Masters'){
}
    //Дети
if(data === 'wantKids'){
}
    
if(data === 'noWantKids'){
}
    
if(data === 'haveNwantKids'){
}
    
if(data === 'haveNnowantKids'){
}
    
if(data === 'idkKids'){
}
    //Стиль общения
if(data === 'talkChating'){
}
    
if(data === 'talkPhone'){
}
    
if(data === 'talkVideo'){
}
    
if(data === 'talkNoChating'){
}
    
if(data === 'talkMeet'){
}
    //Язык любви
if(data === 'LoveLAtt'){
}
    
if(data === 'loveLPres'){
}
    
if(data === 'loveLTouch'){
}
    
if(data === 'loveLComplim'){
}
    
if(data === 'loveLTime'){
}
    

}

export {CALLBACK}