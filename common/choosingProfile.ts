import { AppDataSource } from "../src/data-source"
import { User } from "../src/entity/User"
import { extraInfo } from "../src/entity/ExtraInfo"
import { zodiacTypes, 
    persTypes, 
    searchTypes,
    educationTypes, 
    familyPlansTypes,
    loveLangTypes, 
    alcoTypes, 
    smokeTypes, 
    gymTypes, 
    foodTypes, 
    socMediaTypes, 
    commTypes, 
    nightLiveTypes, 
    sexTypes } from "../util/types"
import { UserImages } from "../src/entity/UserImages"
import * as fs from "fs";
import * as path from 'path'
import {InputFile} from 'grammy'

export async function choosingProf1(chatID) {
    const chatId = chatID
    const user = await AppDataSource.manager.findOneBy(User, { chatId });
    const extra = await AppDataSource.manager.findOneBy(extraInfo, { chatId });

    let messageText = `${user.name}, ${user.age}`
    if(extra){
        if(typeof(extra.bio) == 'string'){
            messageText += `\nБио: ${extra.bio}`
        }
        if(extra.language){
            messageText += `\nМои языки📖: ${extra.language}`
        }
        if(typeof(extra.zodiac) == 'number'){
            messageText += `\nМой ЗЗ: ${zodiacTypes[extra.zodiac]}🔮`
        }
        if(extra.height){
            messageText += `\nМой Рост: ${extra.height}📏`
        }
        if(typeof(extra.persType) == 'number'){
            messageText += `\nМой тип личности: ${persTypes[extra.persType]}♟️`
        }
        if(typeof(extra.mySearch) == 'number'){
            messageText += `\nЯ ищу: ${searchTypes[extra.mySearch]}🕵️`
        }
        if(typeof(extra.education) == 'number'){
            messageText += `\nМоё образование: ${educationTypes[extra.education]}📚`
        }
        if(typeof(extra.familyPlans) == 'number'){
            messageText += `\nМои планы на будущее: ${familyPlansTypes[extra.familyPlans]}👪`
        }

        if(typeof(extra.loveLang) == 'number'){
            messageText += `\nМой язык любви: ${loveLangTypes[extra.loveLang]}👻`
        }
        if(typeof(extra.work) == 'string'){
            messageText += `\nМоя работа: ${extra.work}🏭`
        }
        if(typeof(extra.pets) == 'string'){
            messageText += `\nМои питомцы: ${extra.pets}🐈`
        }
        if(typeof(extra.alcohol) == 'number'){
            messageText += `\nМоё отношение к алкоголю: ${alcoTypes[extra.alcohol]}🥃`
        }
        if(typeof(extra.smoke) == 'number'){
            messageText += `\nМоё отношение к курению: ${smokeTypes[extra.smoke]}🚬`
        }
        if(typeof(extra.gym) == 'number'){
            messageText += `\nМоё отношение к спорту: ${gymTypes[extra.gym]}🏋️‍♀️`
        }
        if(typeof(extra.food) == 'number'){
            messageText += `\nМоё отношение к питанию: ${foodTypes[extra.food]}🍔`
        }
        if(typeof(extra.socMedia) == 'number'){
            messageText += `\nМоё отношение к СоцСетям: ${socMediaTypes[extra.socMedia]}📱`
        }
        if(typeof(extra.commType) == 'number'){
            messageText += `\nМой тип общения: ${commTypes[extra.commType]}💬`
        }
        if(typeof(extra.nightLive) == 'number'){
            messageText += `\nОбраз жизни: ${nightLiveTypes[extra.nightLive]}💤`
        }

    }

    return messageText
}

export async function choosingProf(ctx, chatID, chtid) {
    const chatId = chatID;
    const userimages = await AppDataSource.manager.findOneBy(UserImages, { chatId });
  
    if (!userimages || !userimages.photoFileNames?.length) {
    //   await ctx.reply("Фотографии не найдены");
      return;
    }
    const user = await AppDataSource.manager.findOneBy(User, {chatId: chatID})
    const message = `${user.name} ${user.age}`
    const folderPath = path.join(__dirname, "..", "photos");
  
    const mediaGroup = userimages.photoFileNames.map((name, index) => {
      const fullPath = path.join(folderPath, name);
      return {
        type: "photo",
        media: new InputFile(fs.createReadStream(fullPath)),
        ...(index === 0 && {
          caption: message,
        //   reply_markup: keyboard, // reply_markup — только в первом фото
        }),
      };
    });
    ctx.chat.chat_id = chtid
    await ctx.api.sendMediaGroup(chtid, mediaGroup)
    // await ctx.reply(message, {reply_markup:keyboard});
  }