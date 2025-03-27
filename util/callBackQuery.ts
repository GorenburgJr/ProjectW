import { Bot as GrammyBot , InlineKeyboard } from 'grammy'
import * as dotenv from "dotenv";
import { bioKeyboard1, 
        bioKeyboard2, 
        cancelBackKeyboard,
        zodiacKeyboard,
        mainInfoKeyboard,
        typePersKeyboard, 
        mySearchKeyboard, 
        educationKeyboard, 
        familyPlansKeyboard,
        commTypeKeyboard, 
        loveLangKeyboard,
        smokeKeyboard,
        alcoKeyboard,
        gymKeyboard,
        foodKeyboard,
        socMediaKeyboard,
        nightLiveKeyboard,
        sexKeyboard,
        shareLocation,
        twoPhotoKeyboard,
        threePhotoKeyboard,
        fivePhotoKeyboard,
        onePhotoKeyboard,
        settingsBioKeyboard2,
        settingsBioKeyboard1,
        yesNoKeyboard,
        yesNoInKeyboard,
} from './keyboards';
import{AppDataSource} from '../src/data-source'
import { User } from '../src/entity/User';
import { imgUser, msgUser } from './userProfile';
import { extraInfo } from '../src/entity/ExtraInfo';
import { UserImages } from '../src/entity/UserImages';
import { SearchSettings } from '../src/entity/SearchSetting';
import { msgSearch } from './search';
dotenv.config()
const bot = new GrammyBot(process.env.BOT_API_TOKEN as string)



export async function CALLBACK (ctx) {
    const chatId = String(ctx.chat.id)
    const data = ctx.callbackQuery.data;
    const extraInfoRepo = AppDataSource.getRepository(extraInfo)
    const userRepo = AppDataSource.getRepository(User)
    const userPhotoRepo = AppDataSource.getRepository(UserImages)
    const searchSettingsRepo = AppDataSource.getRepository(SearchSettings)
    let user = await AppDataSource.manager.findOneBy(User, { chatId })
    //таблица выбора

    if(data == 'back'){
            switch (ctx.session.editingComponent) {
                case 'persType':
                case 'zodiac':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                case 'gym':
                case 'mainInfo':
                    await ctx.editMessageReplyMarkup({ reply_markup: bioKeyboard1 });
                    break;

                case 'lovelang':
                case 'smoke':
                case 'commStyle':
                case 'alcohol':
                case 'food':
                case 'socmedia':
                case 'commtype':
                case 'nightlive':
                    await ctx.editMessageReplyMarkup({ reply_markup: bioKeyboard2 });
                    break;

                case 'photos':
                    await ctx.editMessageReplyMarkup({ reply_markup: mainInfoKeyboard });
                    break;

                case 'language':
                case 'height':
                case 'bio':
                case 'work':
                case 'pets':
                    await ctx.deleteMessage();
                    break;

                default:
                    // ничего не делаем
                    break;
            }

            switch (ctx.session.SearchSetting) {
                case 'persType':
                case 'zodiac':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                case 'gym':
                case 'mainInfo':
                case 'language':
                case 'height':
                case 'bio':
                    await ctx.editMessageReplyMarkup({ reply_markup: settingsBioKeyboard1 });
                    break;

                case 'lovelang':
                case 'smoke':
                case 'commStyle':
                case 'alcohol':
                case 'food':
                case 'socmedia':
                case 'commtype':
                case 'nightlive':
                case 'work':
                case 'pets':
                    await ctx.editMessageReplyMarkup({ reply_markup: settingsBioKeyboard2 });
                    break;
                default:
                    break;
            }

        ctx.session.editingComponent = null
        ctx.session.SearchSetting = null
        return ctx
    }

    if(typeof(Number(data)) == 'number' && !isNaN(Number(data))){
            switch (ctx.session.editingComponent) {
                case 'zodiac':
                case 'persType':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                  await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent.toLowerCase()]: Number(data) });
                  await ctx.editMessageText(await msgUser(ctx), { reply_markup: bioKeyboard1 });
                  break;
              
                case 'lovelang':
                case 'alcohol':
                case 'smoke':
                case 'gym':
                case 'food':
                case 'socmedia':
                case 'commtype':
                case 'nightlive':
                  await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent.toLowerCase()]: Number(data) });
                  await ctx.editMessageText(await msgUser(ctx), { reply_markup: bioKeyboard2 });
                  break;
              
                case 'photos':
                  const images = await userPhotoRepo.findOneBy({ chatId });
                  images.photoFilenames.splice(data, 1);
                  await userPhotoRepo.update({ chatId }, { photoFilenames: images.photoFilenames });
              
                  await imgUser(ctx);
                  await ctx.reply(await msgUser(ctx));
              
                  if (images.photoFilenames.length === 1) {
                    await ctx.reply('Нужно как минимум 1 фотография');
                    ctx.session.editingComponent = 'mainInfo';
                  }
                  break;
              
                default:
                  break;
              }
              
            switch (ctx.session.settingComponent) {
                case 'zodiac':
                case 'persType':
                case 'mySearch':
                case 'education':
                
                await searchSettingsRepo.update({ chatId }, {
                    [ctx.session.settingComponent.toLowerCase()]: Number(data),
                });
                await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard1 });
                break;
            
                case 'familyPlans':
                case 'lovelang':
                case 'alcohol':
                case 'smoke':
                case 'gym':
                case 'food':
                case 'socmedia':
                case 'commtype':
                case 'nightlive':
                await searchSettingsRepo.update({ chatId }, {
                    [ctx.session.settingComponent]: Number(data),
                });
                await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard2 });
                break;
            
                default:
                break;
            }
          
            ctx.session.settingComponent = null
            ctx.session.editingComponent = null
            return ctx
    }

    if(data === 'delete'){
        const comp = ctx.session.editingComponent;
        const setComp = ctx.session.settingComponent;
        let key = 0;
        (comp === 'language')? (await extraInfoRepo.update({ chatId }, { languages: null }),key = 3) : void 0;
        (comp === 'zodiac')?(await extraInfoRepo.update({ chatId }, { zodiacsign: null }),key = 0): void 0;
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
        (comp === 'alcohol')? (await extraInfoRepo.update({ chatId }, { alcohol: null }), key = 1) : void 0;
        (comp === 'smoke')? (await extraInfoRepo.update({ chatId }, { smoke: null }), key = 1) : void 0;
        (comp === 'gym')? (await extraInfoRepo.update({ chatId }, { gym: null }), key = 1) : void 0;
        (comp === 'food')? (await extraInfoRepo.update({ chatId }, { food: null }), key = 1) : void 0;
        (comp === 'socmedia')?(await extraInfoRepo.update({ chatId }, { socmedia: null }), key = 1) : void 0;
        (comp === 'nightlive')? (await extraInfoRepo.update({ chatId }, { nightlive: null }), key = 1) : void 0;
        (comp === 'searchStatus')? (await userRepo.update({ chatId },{ inSearch: false }), key = 1,ctx.reply("До новых встреч!"), user = undefined) : void 0;
        
        (setComp === 'language')?(await searchSettingsRepo.update({ chatId }, { languages: null }),key = 4) : void 0;
        (setComp === 'zodiac')?(await searchSettingsRepo.update({ chatId }, { zodiacsign: null }),key = 4): void 0;
        (setComp === 'height')? (await searchSettingsRepo.update({ chatId }, { height: null }),key = 3) : void 0;
        (setComp === 'persType')? await searchSettingsRepo.update({ chatId }, { perstype: null }) : void 0;
        (setComp === 'search')? await searchSettingsRepo.update({ chatId }, { mysearch: null }) : void 0;
        (setComp === 'education')? await searchSettingsRepo.update({ chatId }, { education: null }) : void 0;
        (setComp === 'familyPlans')? await searchSettingsRepo.update({ chatId }, { familyplans: null }) : void 0;
        (setComp === 'bio')? await searchSettingsRepo.update({ chatId }, { text: null }) : void 0;
        (setComp === 'commType')? await searchSettingsRepo.update({ chatId }, { commtype: null }) : void 0;
        (setComp === 'lovelang')? (await searchSettingsRepo.update({ chatId }, { lovelang: null }), key = 1) : void 0;
        (setComp === 'work')? (await searchSettingsRepo.update({ chatId }, { work: null }), key = 1) : void 0;
        (setComp === 'pets')? (await searchSettingsRepo.update({ chatId }, { pets: null }), key = 1) : void 0;
        (setComp === 'alcohol')? (await searchSettingsRepo.update({ chatId }, { alcohol: null }), key = 1) : void 0;
        (setComp === 'smoke')? (await searchSettingsRepo.update({ chatId }, { smoke: null }), key = 1) : void 0;
        (setComp === 'gym')? (await searchSettingsRepo.update({ chatId }, { gym: null }), key = 1) : void 0;
        (setComp === 'food')? (await searchSettingsRepo.update({ chatId }, { food: null }), key = 1) : void 0;
        (setComp === 'socmedia')?(await searchSettingsRepo.update({ chatId }, { socmedia: null }), key = 1) : void 0;
        (setComp === 'nightlive')? (await searchSettingsRepo.update({ chatId }, { nightlive: null }), key = 1) : void 0;

        if(key == 0){
          ctx.editMessageText(await msgUser(ctx),{reply_markup: bioKeyboard1})
        } else 
        if (key == 1){
          ctx.editMessageText(await msgUser(ctx),{reply_markup: bioKeyboard2})
        } else 
        if(key == 3){
          ctx.deleteMessage()
          await imgUser(ctx)
          ctx.reply(await msgUser(ctx), {
            reply_markup: bioKeyboard1
          })
        }
        ctx.session.editingComponent = null
      }
    
    if(data === 'mainInfo'){
        ctx.session.editingComponent = 'mainInfo'
        ctx.editMessageReplyMarkup({reply_markup: mainInfoKeyboard})
        return  ctx
    }
    
    if(data === 'languges'){
        ctx.session.editingComponent = 'language'
        ctx.reply('Напиши Языки',{reply_markup: cancelBackKeyboard})
        return ctx
    }
    
    if(data === 'zodiac_sigh'){
        console.log(user)
        if(user.inSearch === true){
            console.log(true)
            ctx.session.settingComponent = 'zodiac'
        }else {
        ctx.session.editingComponent = 'zodiac'
        }
        ctx.editMessageReplyMarkup({reply_markup: zodiacKeyboard})
        console.log(ctx.session)
        return ctx
    }

    if(data === 'height'){
        ctx.reply('Напиши свой рост',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'height'
        return ctx
    }
    
    if(data === 'perstype'){
        if(user.inSearch){
            ctx.session.settingComponent = 'persType'
        }else {
        ctx.session.editingComponent = 'persType'
        }
        ctx.editMessageReplyMarkup({reply_markup: typePersKeyboard})
        return ctx
    }
    
    if(data === 'mySearch'){
        if(user.inSearch){
            ctx.session.settingComponent = 'mySearch'
        }else {
        ctx.session.editingComponent = 'mySearch'
        }
        ctx.editMessageReplyMarkup({reply_markup: mySearchKeyboard})
        return ctx
    }
    
    if(data === 'education'){
        if(user.inSearch){
            ctx.session.settingComponent = 'education'
        }else {
        ctx.session.editingComponent = 'education'
        }
        ctx.editMessageReplyMarkup({reply_markup: educationKeyboard})
        return ctx
    }
    
    if(data === 'familyPlans'){
        if(user.inSearch){
            ctx.session.settingComponent = 'familyPlans'
        }else {
        ctx.session.editingComponent = 'familyPlans'
        }
        ctx.editMessageReplyMarkup({reply_markup: familyPlansKeyboard})
        return ctx
    }
    
    if(data === 'bio'){
        if(user.inSearch){
            ctx.session.settingComponent = 'bio'
            ctx.editMessageReplyMarkup({reply_markup: yesNoInKeyboard})
        }else {
        ctx.reply('Напиши о себе(Ограничение:500 символов)',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'bio'
        }
        return ctx
    }
    
    if(data === 'commtype'){
        if(user.inSearch){
            ctx.session.settingComponent = 'commtype'
        }else {
        ctx.session.editingComponent = 'commtype'
        }
        ctx.editMessageReplyMarkup({reply_markup: commTypeKeyboard})
        return ctx
    }

    if(data === 'loveLang'){
        if(user.inSearch){
            ctx.session.settingComponent = 'lovelang'
        }else {
        ctx.session.editingComponent = 'lovelang'
        }
        ctx.editMessageReplyMarkup({reply_markup: loveLangKeyboard})
        return ctx
    }
    
    if(data === 'work'){
        if(user.inSearch){
            ctx.session.settingComponent = 'work'
            ctx.editMessageReplyMarkup({reply_markup: yesNoInKeyboard})
        }else {
        ctx.reply('Напиши о своей работе(Ограничение:50 символов)',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'work'
        }
        return ctx
    }
    
    if(data === 'pets'){
        if(user.inSearch){
            ctx.session.settingComponent = 'pets'
            ctx.editMessageReplyMarkup({reply_markup: yesNoInKeyboard})
        }else {
        ctx.reply('Напиши о своих питомцах(Ограничение:50 символов)',{reply_markup: cancelBackKeyboard})
        ctx.session.editingComponent = 'pets'
        }
        return ctx
    }
    
    if(data === 'alcohol'){
        if(user.inSearch){
            ctx.session.settingComponent = 'alcohol'
        }else {
        ctx.session.editingComponent = 'alcohol'
        }
        ctx.editMessageReplyMarkup({reply_markup: alcoKeyboard})
        return ctx
    }
    
    if(data === 'smoke'){
        if(user.inSearch){
            ctx.session.settingComponent = 'smoke'
        }else {
        ctx.session.editingComponent = 'smoke'
        }
        ctx.editMessageReplyMarkup({reply_markup: smokeKeyboard})
        return ctx
    }
    
    if(data === 'gym'){
        if(user.inSearch){
            ctx.session.settingComponent = 'gym'
        }else {
        ctx.session.editingComponent = 'gym'
        }
        ctx.editMessageReplyMarkup({reply_markup: gymKeyboard})
        return ctx
    }
    
    if(data === 'food'){
        if(user.inSearch){
            ctx.session.settingComponent = 'food'
        }else {
        ctx.session.editingComponent = 'food'
        }
        ctx.editMessageReplyMarkup({reply_markup: foodKeyboard})
        return ctx
    }
    
    if(data === 'socmedia'){
        if(user.inSearch){
            ctx.session.settingComponent = 'socmedia'
        }else {
        ctx.session.editingComponent = 'socmedia'
        }
        ctx.editMessageReplyMarkup({reply_markup: socMediaKeyboard})
        return ctx
    }
    
    if(data === 'nightlive'){
        if(user.inSearch){
            ctx.session.settingComponent = 'nightlive'
        }else {
        ctx.session.editingComponent = 'nightlive'
        }
        ctx.editMessageReplyMarkup({reply_markup: nightLiveKeyboard})
        return ctx
    }
    // навигация по разделам
    if (data === 'forward') {
        if(user.inSearch){
            ctx.editMessageReplyMarkup({reply_markup: settingsBioKeyboard2})
        }else {
            ctx.editMessageReplyMarkup({reply_markup: bioKeyboard2})
        }
        return ctx
    }

    if (data === 'backward'){
        if(user.inSearch){
            ctx.editMessageReplyMarkup({reply_markup: settingsBioKeyboard1})
        }else {
            ctx.editMessageReplyMarkup({reply_markup: bioKeyboard1})
        }
        return ctx
    }
    
    if(data === 'quitEditing'){
        ctx.reply('Анкета успешно сохранена!')
        ctx.reply('Приступим к поиску')
        ctx.editing = false 
        ctx.session.step = null
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
        ctx.session.editingComponent = 'location'
        ctx.reply('Отправь локацию', {reply_markup:shareLocation})
        return ctx
    }

    if(data === 'stopSearching'){
        await userRepo.update({ chatId }, { inSearch: false })
    }
    
    if(data === 'continueSearching'){
        await userRepo.update({ chatId }, { inSearch: true })
    }

    if(data === 'photos'){
        const userPhotoRepo = AppDataSource.getRepository(UserImages)
        let images = await userPhotoRepo.findOneBy({ chatId });
        (images.photoFilenames.length == 1)?await ctx.editMessageReplyMarkup({reply_markup: onePhotoKeyboard}): void 0;
        (images.photoFilenames.length == 2)?await ctx.editMessageReplyMarkup({reply_markup: twoPhotoKeyboard}): void 0;
        (images.photoFilenames.length == 3)?await ctx.editMessageReplyMarkup({reply_markup: threePhotoKeyboard}): void 0;
        (images.photoFilenames.length == 4)?await ctx.editMessageReplyMarkup({reply_markup: foodKeyboard}): void 0;
        (images.photoFilenames.length == 5)?await ctx.editMessageReplyMarkup({reply_markup: fivePhotoKeyboard}): void 0;
        ctx.session.editingComponent = 'photos'
        return ctx
    }

    if(data === 'addPhoto'){
        ctx.session.step = 'askPhotos'
        ctx.reply('Отправь еще фотографии')
        return ctx
    }

    if(data === 'stopPhotos'){
        if(ctx.session.editing === true){
            imgUser(ctx)
            ctx.reply(await msgUser(ctx))
            ctx.session.step = null
            return ctx
        }
        if(ctx.session.step == 'askPhotos'){
            ctx.reply('Отправь локацию', {reply_markup: shareLocation})
            ctx.session.step = 'askLocation'
          return ctx
        }
    }



}