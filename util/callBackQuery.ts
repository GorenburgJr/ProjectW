import { Bot as GrammyBot , InlineKeyboard } from 'grammy'
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
        shareLocation,
        twoPhotoKeyboard,
        threePhotoKeyboard,
        fivePhotoKeyboard,
        onePhotoKeyboard,
        settingsBioKeyboard2,
        settingsBioKeyboard1,
        yesNoInKeyboard,
        sexInKeyboard,
        fourPhotoKeyboard,
        chooseUserKeyboard,
        chooseUserExtraKeyboard,
} from './keyboards';
import{AppDataSource} from '../src/data-source'
import { User } from '../src/entity/User';
import { imgUser, msgUser } from '../common/userProfile';
import { ExtraInfo } from '../src/entity/ExtraInfo';
import { UserImages } from '../src/entity/UserImages';
import { SearchSettings } from '../src/entity/SearchSetting';
import { findUsersNearby} from './search';
import { msgSearch } from '../common/userSearchProfile';
import { deletingUserPhoto } from './workWithPhoto';
import { ProfileStack } from '../src/entity/profileStack';
import { choosingProfExtraInfo, choosingProfPhoto, choosingProfText, smartRound } from '../common/choosingProfile';
import { Reactions } from '../src/entity/Reactions';
import { Letter } from '../src/entity/Letters';
import { escapeMarkdownV2 } from './escapeMarkdownV2';



export async function CALLBACK (ctx) {
    const chatId = String(ctx.chat.id)
    const data = ctx.callbackQuery.data;
    const ExtraInfoRepo = AppDataSource.getRepository(ExtraInfo)
    const userRepo = AppDataSource.getRepository(User)
    const searchSettingsRepo = AppDataSource.getRepository(SearchSettings)
    let user = await AppDataSource.manager.findOneBy(User, { chatId })
    const setComponent = (key: string) => {
            if (user.inSearch) {
              ctx.session.searchSettingComponent = key;
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
              await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: Number(data) });
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
              await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: Number(data) });
              await ctx.editMessageText(await msgUser(ctx), { reply_markup: bioKeyboard2 });
              break;
          
            case 'photo':
                    await deletingUserPhoto(ctx, Number(data)); //отправляем запрос на удаление фото
                    await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)// подгружаем старое сообщение
                    ctx.session.editingComponent = 'mainInfo'
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
          
        switch (ctx.session.searchSettingComponent) {
            case 'zodiac':
            case 'persType':
            case 'mySearch':
            case 'education':
            
            await searchSettingsRepo.update({ chatId }, {
                [ctx.session.searchSettingComponent]: Number(data),
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
                [ctx.session.searchSettingComponent]: Number(data),
            });
            await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard2 });
            break;
            case 'bio':
                switch(data){
                    case '0':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.searchSettingComponent]: false,})
                        break;
                    case '1':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.searchSettingComponent]: false,})
                        break;
                }
                await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard1 })
                break  
            case 'work':
            case 'pets':
                switch(data){
                    case '0':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.searchSettingComponent]: false,})
                        break;
                    case '1':await searchSettingsRepo.update({ chatId }, {
                        [ctx.session.searchSettingComponent]: false,})
                        break;
                }
                await ctx.editMessageText(await msgSearch(ctx), { reply_markup: settingsBioKeyboard2 })
                break            
                default:
            break;
        }
      
        ctx.session.searchSettingComponent = null
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

            switch (ctx.session.searchSettingComponent) {
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
                    break;
                
                default:
                    break;
            }

        ctx.session.activeStepName = null
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
                    await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    ctx.editMessageText(await msgUser(ctx), {reply_markup:bioKeyboard1})
                    break;
                case 'height':
                case 'language':
                case 'bio':
                    await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
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
                    await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    ctx.editMessageText(await msgUser(ctx), {reply_markup:bioKeyboard2})
                    break;
                case 'work':
                case 'pets':
                    ctx.deleteMessage()
                    await ExtraInfoRepo.update({ chatId }, { [ctx.session.editingComponent]: null })
                    await imgUser(ctx,await msgUser(ctx), bioKeyboard2)
                    break;
            }
            switch (ctx.session.searchSettingComponent){
                case 'language':
                case 'zodiac':
                case 'height': 
                case 'persType':
                case 'mySearch':
                case 'education':
                case 'familyPlans':
                case 'bio':
                    await searchSettingsRepo.update({ chatId }, { [ctx.session.searchSettingComponent]: null })
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
                    await searchSettingsRepo.update({ chatId }, { [ctx.session.searchSettingComponent]: null })
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
                ctx.session.searchSettingComponent = 'radius';
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
              if(ctx.session.searchSettingComponent === 'age'){
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
              await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
              await userRepo.update({ chatId }, { inSearch: false });
              break;
        
            case 'continueSearching':
              await imgUser(ctx,await msgUser(ctx), mainInfoKeyboard)
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
              } else if (ctx.session.activeStepName === 'askPhotos') {
                await ctx.reply('Отправь локацию', { reply_markup: shareLocation });
                ctx.session.activeStepName = 'askLocation';
              }
              break;
            
            // === ПОИСК ===
            case 'startSearch':{
              let profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
                profileStack = new ProfileStack()
                profileStack.chatId = chatId
                profileStack.stack = []
                const arr = await findUsersNearby(user)
                arr.forEach(element => {
                  profileStack.stack.push(element)
                });
              await AppDataSource.manager.update(ProfileStack, {chatId}, {stack: null})
              await AppDataSource.manager.save(profileStack)
              const letters = await AppDataSource.manager.findBy(Letter, {toUser: chatId})
              if(letters.length>= 1){
                letters.forEach(async element => {
                  const fromUser = await AppDataSource.manager.findOneBy(User, {chatId: element.fromUser})
                  const distance = smartRound(element.distance)
                  const name = escapeMarkdownV2(fromUser.name)
                  const userName = escapeMarkdownV2(fromUser.userName)
                  const age = escapeMarkdownV2(fromUser.age.toString())
                  const dist = escapeMarkdownV2(distance.toString())
                  const message = escapeMarkdownV2(element.text)
                  ctx.reply(`Сообщение от [${name}](t.me/${userName}), ${age}, ${dist}км\\.\\: ${message}`, {
                    parse_mode: 'MarkdownV2',
                    disable_web_page_preview: true,
                    reply_markup: new InlineKeyboard().text('Прододжить', 'startSearch')
                  });

                });
                await AppDataSource.manager.delete(Letter, {toUser: chatId})
                break
              }
              ctx.reply(`По твоему запросу было найдено ${arr.length} пользователей. Вот первый из них`)
              await choosingProfPhoto(ctx, profileStack.stack[0].chatId, user.chatId)
              ctx.reply(await choosingProfText(profileStack.stack[0].chatId, profileStack.stack[0].distance), {reply_markup: chooseUserKeyboard})
              ctx.session.stackIndex = 0;
              break;}
            case 'like':{
              const profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
              if(typeof(ctx.session.stackIndex) !== 'number'){
                ctx.session.stackIndex = 0
              }
              let index = ctx.session.stackIndex
              const like = new Reactions
              like.fromUser = chatId
              like.toUser =  profileStack.stack[index].chatId
              like.reactionType = true
              like.date = new Date()
              let checkReaction = await AppDataSource.manager.findOneBy(Reactions,{ fromUser:profileStack.stack[index].chatId, toUser:chatId})
              if(checkReaction){ //есть ли реакция на этого пользователя уже
                switch(checkReaction.reactionType){
                  case true://взаимная симпатия
                    let choosedUser = await AppDataSource.manager.findOneBy(User, {chatId: profileStack.stack[index].chatId})
                    ctx.reply(`У вас взаимная симпатия с [${choosedUser.name}](t.me/${choosedUser.userName})`, {
                      parse_mode: 'MarkdownV2',
                      disable_web_page_preview: true
                    })
                    break;
                  case false:
                    break;
                }
              }
              await AppDataSource.manager.delete(Reactions, {fromUser: chatId, toUser: profileStack.stack[index].chatId})//удаляем предыдущие
              await AppDataSource.manager.save(Reactions, like)//сохраняем лайк
              index += 1
              if(profileStack.stack.length-1 < index){
                ctx.reply(`Анкеты по твоему запросу кончились\nПопробуй изменить настройки для поиска\n\n${await msgSearch(ctx)}`,{reply_markup: settingsBioKeyboard1})
                break
              }
              await choosingProfPhoto(ctx, profileStack.stack[index].chatId, user.chatId)
              ctx.reply(await choosingProfText(profileStack.stack[index].chatId, profileStack.stack[index].distance), {reply_markup: chooseUserKeyboard})
              ctx.session.stackIndex = index
              break;}
            case 'dislike':{
              const profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
              if(typeof(ctx.session.stackIndex) !== 'number'){
                ctx.session.stackIndex = 0
              }
              let index = ctx.session.stackIndex
              // === Если нужно будет сохранять Дизы ===
              // const like = new Reactions
              // like.fromUser = chatId
              // like.toUser =  profileStack.stack[index].chatId
              // like.reactionType = true
              // like.date = new Date()
              // await AppDataSource.manager.delete(Reactions, {fromUser: chatId, toUser: profileStack.stack[index].chatId})//удаляем предыдущие
              // await AppDataSource.manager.save(Reactions, like)
              index += 1
              if(profileStack.stack.length-1 < index){
                ctx.reply(`Анкеты по твоему запросу кончились\nПопробуй изменить настройки для поиска\n\n${await msgSearch(ctx)}`,{reply_markup: settingsBioKeyboard1})
                break
              }
              await choosingProfPhoto(ctx, profileStack.stack[index].chatId, user.chatId)
              ctx.reply(await choosingProfText(profileStack.stack[index].chatId, profileStack.stack[index].distance), {reply_markup: chooseUserKeyboard})
              ctx.session.stackIndex = index
              break;}
            case 'letter':{
              ctx.reply('Напишите сообщение пользователю.\nОграничение:100 символов')
              ctx.session.letter = true
            }
            case 'showBio':{
              let index = ctx.session.stackIndex
              const profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
              ctx.editMessageText(await choosingProfExtraInfo(profileStack.stack[index].chatId), {reply_markup: chooseUserExtraKeyboard})
              break;}
            case 'closeBio':{
              let index = ctx.session.stackIndex
              const profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
              ctx.editMessageText(await choosingProfText(profileStack.stack[index].chatId, profileStack.stack[index].distance), {reply_markup: chooseUserKeyboard})
              break;
            }
            case 'fromBack':{
              let index = ctx.session.stackIndex
              if(index == 0){
                ctx.reply('Нельзя отлистать назад')
                break;
              }
              index -= 1
              const profileStack = await AppDataSource.manager.findOneBy(ProfileStack,{ chatId })
              await choosingProfPhoto(ctx, profileStack.stack[index].chatId, user.chatId)
              ctx.reply(await choosingProfText(profileStack.stack[index].chatId, profileStack.stack[index].distance), {reply_markup: chooseUserKeyboard})
              ctx.session.stackIndex = index
              break;}
            case 'stopChoosing':
              ctx.reply('Твою анкету теперь не видно',{reply_markup: mainInfoKeyboard})
              await userRepo.update({ chatId }, { inSearch: false });
              ctx.editingComponent = 'maininfo'
            default:
              break;
        }
            
          return ctx
        }
        