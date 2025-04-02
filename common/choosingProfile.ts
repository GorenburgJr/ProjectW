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
    nightLiveTypes} from "../util/types"
import { UserImages } from "../src/entity/UserImages"
import * as fs from "fs";
import * as path from 'path'
import {InputFile} from 'grammy'

export function smartRound(value: number): number {
    if (value < 500) {
      return 500;
    }
    return Math.ceil(value / 500) * 500;
  }

export async function choosingProfText(chatID , distance) { //не сделано
    const chatId = chatID
    const user = await AppDataSource.manager.findOneBy(User, { chatId });
    const extra = await AppDataSource.manager.findOneBy(ExtraInfo, { chatId });

    let messageText = `${user.name}, ${user.age} ,Расстояние: ${smartRound(distance)/1000} км.`
    if(extra){
        if(typeof(extra.bio) == 'string'){
            messageText += `\nБио: ${extra.bio}`
        }
    }
    return messageText
}

export async function choosingProfExtraInfo(chatId) {
    const extra = await AppDataSource.manager.findOneBy(ExtraInfo, {chatId})
    let messageText = []
    if(extra){
        if(extra.language){
            messageText.push(`Мои языки📖: ${extra.language}`)
        }
        if(typeof(extra.zodiac) == 'number'){
            messageText.push(`ЗЗ: ${zodiacTypes[extra.zodiac]}🔮`)
        }
        if(extra.height){
            messageText.push(`Рост: ${extra.height}📏`)
        }
        if(typeof(extra.persType) == 'number'){
            messageText.push(`Тип личности: ${persTypes[extra.persType]}♟️`)
        }
        if(typeof(extra.mySearch) == 'number'){
            messageText.push(`Ищет: ${searchTypes[extra.mySearch]}🕵️`)
        }
        if(typeof(extra.education) == 'number'){
            messageText.push(`Образование: ${educationTypes[extra.education]}📚`)
        }
        if(typeof(extra.familyPlans) == 'number'){
            messageText.push(`Планы на будущее: ${familyPlansTypes[extra.familyPlans]}👪`)
        }
        if(typeof(extra.loveLang) == 'number'){
            messageText.push(`Язык любви: ${loveLangTypes[extra.loveLang]}👻`)
        }
        if(typeof(extra.work) == 'string'){
            messageText.push(`Работа: ${extra.work}🏭`)
        }
        if(typeof(extra.pets) == 'string'){
            messageText.push(`Питомцы: ${extra.pets}🐈`)
        }
        if(typeof(extra.alcohol) == 'number'){
            messageText.push(`Отношение к алкоголю: ${alcoTypes[extra.alcohol]}🥃`)
        }
        if(typeof(extra.smoke) == 'number'){
            messageText.push(`Отношение к курению: ${smokeTypes[extra.smoke]}🚬`)
        }
        if(typeof(extra.gym) == 'number'){
            messageText.push(`Отношение к спорту: ${gymTypes[extra.gym]}🏋️‍♀️`)
        }
        if(typeof(extra.food) == 'number'){
            messageText.push(`Отношение к питанию: ${foodTypes[extra.food]}🍔`)
        }
        if(typeof(extra.socMedia) == 'number'){
            messageText.push(`Отношение к СоцСетям: ${socMediaTypes[extra.socMedia]}📱`)
        }
        if(typeof(extra.commType) == 'number'){
            messageText.push(`Тип общения: ${commTypes[extra.commType]}💬`)
        }
        if(typeof(extra.nightLive) == 'number'){
            messageText.push(`Образ жизни: ${nightLiveTypes[extra.nightLive]}💤`)
        }
    }
    return messageText.join('\n')
}

export async function choosingProfPhoto(ctx, findedUser, toSendId) {
    const userimages = await AppDataSource.manager.findOneBy(UserImages, { chatId: findedUser });

    const folderPath = path.join(__dirname, "..", "photos");
  
    const mediaGroup = userimages.photoFileNames.map((name, index) => {
    const fullPath = path.join(folderPath, name);
      return {
        type: "photo",
        media: new InputFile(fs.createReadStream(fullPath)),
      };
    });

    await ctx.api.sendMediaGroup(toSendId, mediaGroup)
}