import { Bot as GrammyBot , InlineKeyboard } from 'grammy'
import * as dotenv from "dotenv";
import { bioKeyboard1, bioKeyboard2, cancelBackKeyboard,zodiacKeyboard,mainInfoKeyboard,
        typePersKeyboard, mySearchKeyboard, educationKeyboard, familyPlansKeyboard,
        commTypeKeyboard, loveLangKeyboard,
        smokeKeyboard,
        alcoKeyboard,
        gymKeyboard,
        foodKeyboard,
        socMediaKeyboard,
        nightLiveKeyboard,
        sexKeyboard,
        shareLocation} from './keyboards';
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
    const userRepo = AppDataSource.getRepository(User)
    //таблица выбора
    if(data == 'back'){
        (ctx.session.editingComponent === 'persType')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        (ctx.session.editingComponent === 'language')?ctx.deleteMessage(): void 0;
        (ctx.session.editingComponent === 'zodiac')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        (ctx.session.editingComponent === 'height')?ctx.deleteMessage(): void 0;
        (ctx.session.editingComponent === 'search')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        (ctx.session.editingComponent === 'education')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        (ctx.session.editingComponent === 'familyPlans')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        (ctx.session.editingComponent === 'bio')?ctx.deleteMessage(): void 0;
        (ctx.session.editingComponent === 'lovelang')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'work')?ctx.deleteMessage(): void 0;
        (ctx.session.editingComponent === 'pets')?ctx.deleteMessage(): void 0;
        (ctx.session.editingComponent === 'smoke')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'commStyle')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'alcohol')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'food')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'gym')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        (ctx.session.editingComponent === 'socmedia')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'commtype')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'nightlive')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})): void 0;
        (ctx.session.editingComponent === 'mainInfo')?(ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})): void 0;
        ctx.session.editingComponent = null
        return ctx
    }
    if(typeof(Number(data)) == 'number' && !isNaN(Number(data))){
        if(ctx.session.editingComponent == 'zodiac'){
            await extraInfoRepo.update({ chatId }, { zodiacsign: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})
            return
        }
        if(ctx.session.editingComponent == 'persType'){
            await extraInfoRepo.update({ chatId }, { perstype: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})
            return
        }
        if(ctx.session.editingComponent == 'search'){
            await extraInfoRepo.update({ chatId }, { mysearch: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})
            return
        }
        if(ctx.session.editingComponent == 'education'){
            await extraInfoRepo.update({ chatId }, { education: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})
            return
        }
        if(ctx.session.editingComponent == 'familyPlans'){
            await extraInfoRepo.update({ chatId }, { familyplans: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard1})
            return
        }
        if(ctx.session.editingComponent == 'lovelang'){
            await extraInfoRepo.update({ chatId }, { lovelang: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'alco'){
            await extraInfoRepo.update({ chatId }, { alcohol: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'smoke'){
            await extraInfoRepo.update({ chatId }, { smoke: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'gym'){
            await extraInfoRepo.update({ chatId }, { gym: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'food'){
            await extraInfoRepo.update({ chatId }, { food: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'socMedia'){
            await extraInfoRepo.update({ chatId }, { socmedia: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'commType'){
            await extraInfoRepo.update({ chatId }, { commtype: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }
        if(ctx.session.editingComponent == 'nightLive'){
            await extraInfoRepo.update({ chatId }, { nightlive: Number(data) })
            ctx.editMessageText(await msgUser(ctx), {reply_markup: bioKeyboard2})
            return
        }

    } else {
    }
    if(data === 'mainInfo'){
        ctx.session.editingComponent = 'mainInfo'
        ctx.editMessageText(await msgUser(ctx), {reply_markup: mainInfoKeyboard})
        return  ctx
    }
    
    if(data === 'languges'){
        ctx.session.editingComponent = 'language'
        ctx.reply('Напиши Языки',{reply_markup: cancelBackKeyboard})
        return ctx
    }
    
    if(data === 'zodiac_sigh'){
        ctx.session.editingComponent = 'zodiac'
        ctx.editMessageText(await msgUser(ctx), {reply_markup: zodiacKeyboard})
        return ctx
    }

    if(data === 'height'){
        ctx.reply('Напиши свой рост',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'height'
        return ctx
    }
    
    if(data === 'perstype'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: typePersKeyboard})
        ctx.session.editingComponent = 'persType'
        return ctx
    }
    
    if(data === 'search'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: mySearchKeyboard})
        ctx.session.editingComponent = 'search'
        return ctx
    }
    
    if(data === 'education'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: educationKeyboard})
        ctx.session.editingComponent = 'education'
        return ctx
    }
    
    if(data === 'familyPlans'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: familyPlansKeyboard})
        ctx.session.editingComponent = 'familyPlans'
        return ctx
        
    }
    
    if(data === 'bio'){
        ctx.reply('Напиши о себе(Ограничение:500 симболов)',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'bio'
        return ctx
    }
    
    if(data === 'commType'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: commTypeKeyboard})
        ctx.session.editingComponent = 'commType'
        return ctx
    }

    if(data === 'loveLang'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: loveLangKeyboard})
        ctx.session.editingComponent = 'lovelang'
        return ctx
    }
    
    if(data === 'work'){
        ctx.reply('Напиши о своей работе(Ограничение:50 симболов)',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'work'
        return ctx
    }
    
    if(data === 'pets'){
        ctx.reply('Напиши о своих питомцах(Ограничение:50 симболов)',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'pets'
        return ctx
    }
    
    if(data === 'alco'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: alcoKeyboard})
        ctx.session.editingComponent = 'alco'
        return ctx
    }
    
    if(data === 'smoke'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: smokeKeyboard})
        ctx.session.editingComponent = 'smoke'
        return ctx
    }
    
    if(data === 'gym'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: gymKeyboard})
        ctx.session.editingComponent = 'gym'
        return ctx
    }
    
    if(data === 'food'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: foodKeyboard})
        ctx.session.editingComponent = 'food'
        return ctx
    }
    
    if(data === 'socMedia'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: socMediaKeyboard})
        ctx.session.editingComponent = 'socMedia'
        return ctx
    }
    
    if(data === 'nightLive'){
        ctx.editMessageText(await msgUser(ctx), {reply_markup: nightLiveKeyboard})
        ctx.session.editingComponent = 'nightLive'
        return ctx
    }
    // навигация по разделам
    if (data === 'forward') {
        ctx.editMessageText(await msgUser(ctx),{reply_markup: bioKeyboard2})
        return ctx
    }

    if (data === 'backward'){
        ctx.editMessageText(await msgUser(ctx),{reply_markup: bioKeyboard1})
        return ctx
    }
    
    if(data === 'quit_editing'){
        ctx.reply('Анкета успешно сохранена!')
        ctx.reply('Приступим к поиску')
        ctx.session.step = "searchProfiles"
        await userRepo.update({ chatId }, { inSearch: true })
        return ctx
    }
    
    if(data === 'name'){
        ctx.session.step = 'askName'
        ctx.reply('Напиши имя')
        return ctx
    }

    if(data === 'age'){
        ctx.session.step = 'askAge'
        ctx.reply('Напиши возраст')
        return ctx
    }
    if(data === 'sex'){
        ctx.session.step = 'askSex'
        ctx.reply('Выбери свой пол', {reply_markup:sexKeyboard})
        return ctx
    }
    
    if(data === 'sexSearch'){
        ctx.session.step = 'askSexSearch'
        ctx.reply('Выбери кого искать', {reply_markup:sexKeyboard})
        return ctx
    }

    if(data === 'location'){
        ctx.session.step = 'askLocation'
        ctx.reply('Отправь локацию', {reply_markup:shareLocation})
        return ctx
    }

    if(data === 'stopSearching'){
        await userRepo.update({ chatId }, { inSearch: false })
    }
    
    if(data === 'continueSearching'){
        await userRepo.update({ chatId }, { inSearch: true })
    }

}

export {CALLBACK}