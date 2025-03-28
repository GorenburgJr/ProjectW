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
        sexInKeyboard,
        fourPhotoKeyboard,
} from './keyboards';
import{AppDataSource} from '../src/data-source'
import { User } from '../src/entity/User';
import { imgUser, msgUser } from '../common/userProfile';
import { extraInfo } from '../src/entity/ExtraInfo';
import { UserImages } from '../src/entity/UserImages';
import { SearchSettings } from '../src/entity/SearchSetting';
import { findUsersNearby} from './search';
import { msgSearch } from '../common/userSearchProfile';
import { deletingUserPhoto } from './workWithPhoto';
import { Location } from '../src/entity/Location';
import { choosingProf } from '../common/choosingProfile';
import { choosingProf1 } from '../common/choosingProfile';
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
    const setComponent = (key: string) => {
            if (user.inSearch) {
              ctx.session.settingComponent = key;
            } else {
              ctx.session.editingComponent = key;
            }
          };
        
    if(typeof(Number(data)) == 'number' && !isNaN(Number(data))){ //изменение значения
        switch (ctx.session.editingComponent) {
            case 'zodiac':
            case 'persType':
            case 'mySearch':
            case 'education':
            case 'familyPlans':
              await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: Number(data) });
              await ctx.editMessageText(await msgUser(ctx), { reply_markup: bioKeyboard1 });
              break;
          
            case 'loveLang':
            case 'alcohol':
            case 'smoke':
            case 'gym':
            case 'food':
            case 'socMedia':
            case 'commType':
            case 'nightLive':
              await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: Number(data) });
              await ctx.editMessageText(await msgUser(ctx), { reply_markup: bioKeyboard2 });
              break;
          
            case 'photo':
                    await deletingUserPhoto(ctx, Number(data)); //отправляем запрос на удаление фото
                    await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)// подгружаем старое сообщение
                    break;
            case 'sex':
            case 'sexSearch':
                await userRepo.update({ chatId }, { [ctx.session.editingComponent]: Number(data) })
                await ctx.editMessageText(await msgUser(ctx), { reply_markup: mainInfoKeyboard })
                ctx.session.editingComponent = 'mainInfo'
                return
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
                [ctx.session.settingComponent]: Number(data),
            });
            await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard1 });
            break;
        
            case 'familyPlans':
            case 'loveLang':
            case 'alcohol':
            case 'smoke':
            case 'gym':
            case 'food':
            case 'socMedia':
            case 'commType':
            case 'nightLive':
            await searchSettingsRepo.update({ chatId }, {
                [ctx.session.settingComponent]: Number(data),
            });
            await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard2 });
            break;
            case 'bio':
                switch(data){
                    case '0':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.settingComponent]: false,})
                        break;
                    case '1':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.settingComponent]: false,})
                        break;
                }
                await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard1 })
                break  
            case 'work':
            case 'pets':
                switch(data){
                    case '0':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.settingComponent]: false,})
                        break;
                    case '1':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.settingComponent]: false,})
                        break;
                }
                await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard2 })
                break            
                default:
            break;
        }
      
        ctx.session.settingComponent = null
        ctx.session.editingComponent = null
        return ctx
}
    //таблица выбора
    switch(data){
        case 'back': //назад по меню
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

                case 'loveLang':
                case 'smoke':
                case 'commStyle':
                case 'alcohol':
                case 'food':
                case 'socMedia':
                case 'commType':
                case 'nightLive':
                    await ctx.editMessageReplyMarkup({ reply_markup: bioKeyboard2 });
                    break;
                case 'language':
                case 'height':
                case 'bio':
                case 'work':
                case 'pets':
                    await ctx.deleteMessage();
                    break;
                case 'name':
                case 'age':
                case 'location':
                    await ctx.deleteMessage();
                    ctx.session.editingComponent = 'mainInfo'
                    return ctx
                case 'photo':
                case 'sex':
                case 'sexSearch':
                    await ctx.editMessageReplyMarkup({ reply_markup: mainInfoKeyboard })
                    ctx.session.editingComponent = 'mainInfo'
                    return ctx
                
                default:
                    // ничего не делаем
                    break;
            }

            switch (ctx.session.settingComponent) {
                case 'persType':
                case 'zodiac':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                case 'gym':
                case 'mainInfo':
                case 'language':
                case 'bio':
                    await ctx.editMessageReplyMarkup({ reply_markup: settingsBioKeyboard1 });
                    break;
                case 'loveLang':
                case 'smoke':
                case 'commStyle':
                case 'alcohol':
                case 'food':
                case 'socMedia':
                case 'commType':
                case 'nightLive':
                case 'work':
                case 'pets':
                    await ctx.editMessageReplyMarkup({ reply_markup: settingsBioKeyboard2 });
                    break;
                case 'height':
                case 'radius':
                case 'age':
                    ctx.deleteMessage()
                    ctx.reply(await msgSearch(ctx) ,{reply_markup: settingsBioKeyboard1})
                    break;
                
                default:
                    break;
            }

        ctx.session.step = null
        ctx.session.editingComponent = null
        ctx.session.searchSetting = null
        break;
    
        case 'delete': //удалить перменную
            switch (ctx.session.editingComponent){
                case 'zodiac':
                case 'persType':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                    await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    ctx.editMessageText(await msgUser(ctx), {reply_markup:bioKeyboard1})
                    break;
                case 'height':
                case 'language':
                case 'bio':
                    await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    await imgUser(ctx,await msgUser(ctx), bioKeyboard1)
                    break;
                case 'loveLang':
                case 'alcohol':
                case 'smoke':
                case 'gym':
                case 'food':
                case 'socMedia':    
                case 'commType':
                case 'nightLive':
                    await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    ctx.editMessageText(await msgUser(ctx), {reply_markup:bioKeyboard2})
                    break;
                case 'work':
                case 'pets':
                    ctx.deleteMessage()
                    await extraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    await imgUser(ctx,await msgUser(ctx), bioKeyboard2)
                    break;
            }
            switch (ctx.session.settingComponent){
                case 'language':
                case 'zodiac':
                case 'height': 
                case 'persType':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                case 'bio':
                    await searchSettingsRepo.update({ chatId }, { [ctx.session.settingComponent]: null })
                    ctx.editMessageText(await msgSearch(ctx), {reply_markup:settingsBioKeyboard1})
                    break;
                case 'loveLang':
                case 'work':
                case 'pets':
                case 'alcohol':
                case 'smoke':
                case 'gym':
                case 'food':
                case 'socMedia':    
                case 'commType':
                case 'nightLive':
                    await searchSettingsRepo.update({ chatId }, { [ctx.session.settingComponent]: null })
                    ctx.editMessageText(await msgSearch(ctx), {reply_markup:settingsBioKeyboard2})
                    break;
            }
            break;
        // === ТЕКСТОВЫЕ ПОЛЯ ===
        case 'languge':
          setComponent('language');
          await ctx.reply('Напиши Языки', { reply_markup: cancelBackKeyboard });
          break;        
        case 'height':
            if (user.inSearch) {
                setComponent('height');
                await ctx.reply('Напиши нижнюю границу роста', { reply_markup: cancelBackKeyboard })
            } else {
                setComponent('height');
                await ctx.reply('Напиши свой рост', { reply_markup: cancelBackKeyboard })
            };
            break;
        
        case 'bio':
            if (user.inSearch) {
                setComponent('bio');
                await ctx.editMessageReplyMarkup({ reply_markup: yesNoInKeyboard });
            } else {
                setComponent('bio');
                await ctx.reply('Напиши о себе(Ограничение:500 символов)', { reply_markup: cancelBackKeyboard });
            }
            break;
        
        case 'work':
            if (user.inSearch) {
                setComponent('work');
                await ctx.editMessageReplyMarkup({ reply_markup: yesNoInKeyboard });
            } else {
                setComponent('work');
                await ctx.reply('Напиши о своей работе(Ограничение:50 символов)', { reply_markup: cancelBackKeyboard });
            }
            break;
        
            case 'pets':
              if (user.inSearch) {
                setComponent('pets');
                await ctx.editMessageReplyMarkup({ reply_markup: yesNoInKeyboard });
              } else {
                setComponent('pets');
                await ctx.reply('Напиши о своих питомцах(Ограничение:50 символов)', { reply_markup: cancelBackKeyboard });
              }
              break;
        
            // === КНОПКИ С КЛАВИАТУРОЙ ===
            case 'mainInfo':
              ctx.session.editingComponent = 'mainInfo';
              await ctx.editMessageReplyMarkup({ reply_markup: mainInfoKeyboard });
              break;
        
            case 'zodiac':
              setComponent('zodiac');
              await ctx.editMessageReplyMarkup({ reply_markup: zodiacKeyboard });
              break;
        
            case 'persType':
              setComponent('persType');
              await ctx.editMessageReplyMarkup({ reply_markup: typePersKeyboard });
              break;
        
            case 'mySearch':
              setComponent('mySearch');
              await ctx.editMessageReplyMarkup({ reply_markup: mySearchKeyboard });
              break;
        
            case 'education':
              setComponent('education');
              await ctx.editMessageReplyMarkup({ reply_markup: educationKeyboard });
              break;
        
            case 'familyPlans':
              setComponent('familyPlans');
              await ctx.editMessageReplyMarkup({ reply_markup: familyPlansKeyboard });
              break;
        
            case 'commType':
              setComponent('commType');
              await ctx.editMessageReplyMarkup({ reply_markup: commTypeKeyboard });
              break;
        
            case 'loveLang':
              setComponent('loveLang');
              await ctx.editMessageReplyMarkup({ reply_markup: loveLangKeyboard });
              break;
        
            case 'alcohol':
              setComponent('alcohol');
              await ctx.editMessageReplyMarkup({ reply_markup: alcoKeyboard });
              break;
        
            case 'smoke':
              setComponent('smoke');
              await ctx.editMessageReplyMarkup({ reply_markup: smokeKeyboard });
              break;
        
            case 'gym':
              setComponent('gym');
              await ctx.editMessageReplyMarkup({ reply_markup: gymKeyboard });
              break;
        
            case 'food':
              setComponent('food');
              await ctx.editMessageReplyMarkup({ reply_markup: foodKeyboard });
              break;
        
            case 'socMedia':
              setComponent('socMedia');
              await ctx.editMessageReplyMarkup({ reply_markup: socMediaKeyboard });
              break;
        
            case 'nightLive':
              setComponent('nightLive');
              await ctx.editMessageReplyMarkup({ reply_markup: nightLiveKeyboard });
              break;
            // === КНОПКИ В ПОИСКЕ ===
            case 'radius':
                ctx.session.settingComponent = 'radius';
                await ctx.reply('Напиши радиус в КМ', {reply_markup: new InlineKeyboard().text('Назад','back')})
                break;
            // === ОСНОВНЫЕ ПЕРЕКЛЮЧАТЕЛИ ===
            case 'forward':
              await ctx.editMessageReplyMarkup({ reply_markup: user.inSearch ? settingsBioKeyboard2 : bioKeyboard2 });
              break;
        
            case 'backward':
              await ctx.editMessageReplyMarkup({ reply_markup: user.inSearch ? settingsBioKeyboard1 : bioKeyboard1 });
              break;
        
            case 'quitEditing':
              await ctx.reply('Анкета успешно сохранена!\nПриступим к поиску');
              await userRepo.update({ chatId }, { inSearch: true });
              ctx.reply(await msgSearch(ctx),{reply_markup: settingsBioKeyboard1})
              break;
        
            case 'name':
                setComponent('name');
                await ctx.reply('Напиши имя', { reply_markup: new InlineKeyboard().text('Назад', 'back') });
                break;
        
            case 'age':
              setComponent('age');
              if(ctx.session.editingComponent === 'age'){
                await ctx.reply('Напиши возраст', { reply_markup: new InlineKeyboard().text('Назад', 'back') })
              }
              if(ctx.session.settingComponent === 'age'){
                await ctx.reply('Напиши нижнюю границу возраста', { reply_markup: new InlineKeyboard().text('Назад', 'back') })
              }
              break;
        
            case 'sex':
              setComponent('sex');
              await ctx.editMessageReplyMarkup({ reply_markup: sexInKeyboard });
              break;
        
            case 'sexSearch':
              setComponent('sexSearch');
              await ctx.editMessageReplyMarkup({ reply_markup: sexInKeyboard });
              break;
        
            case 'location':
              setComponent('location');
              ctx.reply('Отправь локацию', {reply_markup: shareLocation})
              break;
        
            case 'stopSearching':
              await userRepo.update({ chatId }, { inSearch: false });
              break;
        
            case 'continueSearching':
              await userRepo.update({ chatId }, { inSearch: true });
              break;
        
            // === ФОТО ===
            case 'photo':
              const userPhotoRepo = AppDataSource.getRepository(UserImages);
              const images = await userPhotoRepo.findOneBy({ chatId });
              switch (images.photoFileNames.length) {
                case 1:
                    await ctx.editMessageReplyMarkup({ reply_markup: onePhotoKeyboard });
                    break;
                case 2:
                    await ctx.editMessageReplyMarkup({ reply_markup: twoPhotoKeyboard });
                    break;
                case 3:
                    await ctx.editMessageReplyMarkup({ reply_markup: threePhotoKeyboard });
                    break;
                case 4:
                    await ctx.editMessageReplyMarkup({ reply_markup: fourPhotoKeyboard });
                    break;
                case 5:
                    await ctx.editMessageReplyMarkup({ reply_markup: fivePhotoKeyboard });
                    break;
              }
              ctx.session.editingComponent = 'photo';
              return
        
            case 'addPhoto':
              await ctx.reply('Отправь еще фотографии');
              break;
        
            case 'stopPhotos':
              if (ctx.session.editingComponent === 'photo') {
                await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
                ctx.session.editingComponent = 'mainInfo';
              } else if (ctx.session.step === 'askPhotos') {
                await ctx.reply('Отправь локацию', { reply_markup: shareLocation });
                ctx.session.step = 'askLocation';
              }
              break;
            
            // === ПОИСК ===
            case 'startSearch':
                const userPoint = await AppDataSource.manager.findOneBy(Location, { chatId})
                const userSearchSettings = await AppDataSource.manager.findOneBy(SearchSettings, { chatId})

              const nearby = await findUsersNearby(userPoint.location.coordinates[1], userPoint.location.coordinates[0], userSearchSettings.radius, user.chatId);
              
              nearby.forEach(async element => {
                await choosingProf(ctx, element.user.chatId, user.chatId)
              });

              break;

            default:
              break;
        }
            
          return ctx
        }
        