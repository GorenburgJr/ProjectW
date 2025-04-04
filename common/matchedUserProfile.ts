import { Bot as GrammyBot, InputFile} from "grammy";
import { AppDataSource } from "../src/data-source";
import { ExtraInfo } from "../src/entity/ExtraInfo";
import { UserImages } from "../src/entity/UserImages";
import { alcoTypes, commTypes, educationTypes, familyPlansTypes, foodTypes, gymTypes, loveLangTypes, nightLiveTypes, persTypes, searchTypes, smokeTypes, socMediaTypes, zodiacTypes } from "../util/types";
import * as fs from "fs";
import * as path from 'path'
import { InputMediaPhoto } from 'grammy/types'


export async function msgMatchUser(chatId) {
    const extra = await AppDataSource.manager.findOneBy(ExtraInfo, { chatId });
    let messageText = ''
    if(extra){
        if(typeof(extra.bio) == 'string'){
            messageText += `\nБио: ${extra.bio}`
        }
        if(extra.language){
            messageText += `\nЯзыки📖: ${extra.language}`
        }
        if(typeof(extra.zodiac) == 'number'){
            messageText += `\nЗЗ: ${zodiacTypes[extra.zodiac]}🔮`
        }
        if(extra.height){
            messageText += `\nРост: ${extra.height}📏`
        }
        if(typeof(extra.persType) == 'number'){
            messageText += `\nТип личности: ${persTypes[extra.persType]}♟️`
        }
        if(typeof(extra.mySearch) == 'number'){
            messageText += `\nИщу: ${searchTypes[extra.mySearch]}🕵️`
        }
        if(typeof(extra.education) == 'number'){
            messageText += `\nОбразование: ${educationTypes[extra.education]}📚`
        }
        if(typeof(extra.familyPlans) == 'number'){
            messageText += `\nПланы на будущее: ${familyPlansTypes[extra.familyPlans]}👪`
        }

        if(typeof(extra.loveLang) == 'number'){
            messageText += `\nЯзык любви: ${loveLangTypes[extra.loveLang]}👻`
        }
        if(typeof(extra.work) == 'string'){
            messageText += `\nРабота: ${extra.work}🏭`
        }
        if(typeof(extra.pets) == 'string'){
            messageText += `\nПитомцы: ${extra.pets}🐈`
        }
        if(typeof(extra.alcohol) == 'number'){
            messageText += `\nОтношение к алкоголю: ${alcoTypes[extra.alcohol]}🥃`
        }
        if(typeof(extra.smoke) == 'number'){
            messageText += `\nОтношение к курению: ${smokeTypes[extra.smoke]}🚬`
        }
        if(typeof(extra.gym) == 'number'){
            messageText += `\nОтношение к спорту: ${gymTypes[extra.gym]}🏋️‍♀️`
        }
        if(typeof(extra.food) == 'number'){
            messageText += `\nОтношение к питанию: ${foodTypes[extra.food]}🍔`
        }
        if(typeof(extra.socMedia) == 'number'){
            messageText += `\nОтношение к СоцСетям: ${socMediaTypes[extra.socMedia]}📱`
        }
        if(typeof(extra.commType) == 'number'){
            messageText += `\nТип общения: ${commTypes[extra.commType]}💬`
        }
        if(typeof(extra.nightLive) == 'number'){
            messageText += `\nОбраз жизни: ${nightLiveTypes[extra.nightLive]}💤`
        }

    }

    return messageText
}

export async function imgMatchUser(chatId) {
    const bot = new GrammyBot(process.env.BOT_API_TOKEN)
    const userimages = await AppDataSource.manager.findOneBy(UserImages, { chatId });
  
    const folderPath = path.join(__dirname, "..", "photos");
  
    const mediaGroup = userimages.photoFileNames.map((name, index) => {
      const fullPath = path.join(folderPath, name);
      return {
        type: "photo",
        media: new InputFile(fs.createReadStream(fullPath))
      };
    }) as InputMediaPhoto[]
    await bot.api.sendMediaGroup(chatId, mediaGroup)
    
  }