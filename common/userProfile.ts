import { AppDataSource } from "../src/data-source"
import { User } from "../src/entity/User"
import { ExtraInfo } from "../src/entity/ExtraInfo"
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
    sexTypes, 
    YesNoTypes} from "../util/types"
import { UserImages } from "../src/entity/UserImages"
import * as fs from "fs";
import * as path from 'path'
import {Bot as GrammyBot, InputFile} from 'grammy'
import { InputMediaPhoto } from "grammy/types"

export async function msgUser(ctx) {
    const chatId = String(ctx.chat.id)
    const user = await AppDataSource.manager.findOneBy(User, { chatId });
    const extra = await AppDataSource.manager.findOneBy(ExtraInfo, { chatId });

    let messageText = `${ctx.chat.first_name}, Твой профиль сейчас выглядит так:
    ${user.name}, ${user.age}, Я:${sexTypes[user.sex]}, Ищу:${sexTypes[user.sexSearch]}, 
    Анкета активна:${YesNoTypes[String(user.inSearch) as 'true' | 'false']}`
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

export async function imgUser(ctx, message: string, keyboard) {
    const chatId = String(ctx.chat.id);
    const userimages = await AppDataSource.manager.findOneBy(UserImages, { chatId });
  
    if (!userimages || !userimages.photoFileNames?.length) {
      await ctx.reply("Фотографии не найдены");
      return;
    }
  
    const folderPath = path.join(__dirname, "..", "photos");
  
    const mediaGroup = userimages.photoFileNames.map((name, index) => {
      const fullPath = path.join(folderPath, name);
      return {
        type: "photo",
        media: new InputFile(fs.createReadStream(fullPath)),
        // ...(index === 0 && {
        //   caption: message,
        //   reply_markup: keyboard, // reply_markup — только в первом фото
        // })
      }
    })
  
    await ctx.api.sendMediaGroup(chatId, mediaGroup)
    await ctx.reply(message, {reply_markup:keyboard});
  }

