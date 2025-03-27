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
    sexTypes } from "./types"
import { UserImages } from "../src/entity/UserImages"
import * as fs from "fs";
import * as path from 'path'
import {InputFile} from 'grammy'

async function msgUser(ctx) {
    const chatId = String(ctx.chat.id)
    const user = await AppDataSource.manager.findOneBy(User, { chatId });
    const extra = await AppDataSource.manager.findOneBy(extraInfo, { chatId });

    let messageText = `${ctx.from.first_name}, Твой профиль сейчас выглядит так:\n ${user.name}, ${user.age}, Я:${sexTypes[user.sex.toString()]}, Ищу:${sexTypes[user.sexSearch.toString()]}`
    if(extra){
        if(typeof(extra.text) == 'string'){
            messageText += `\nБио: ${extra.text}`
        }
        if(extra.languages){
            messageText += `\nМои языки📖: ${extra.languages}`
        }
        if(typeof(extra.zodiacsign) == 'number'){
            messageText += `\nМой ЗЗ: ${zodiacTypes[extra.zodiacsign]}🔮`
        }
        if(extra.height){
            messageText += `\nМой Рост: ${extra.height}📏`
        }
        if(typeof(extra.perstype) == 'number'){
            messageText += `\nМой тип личности: ${persTypes[extra.perstype]}♟️`
        }
        if(typeof(extra.mysearch) == 'number'){
            messageText += `\nЯ ищу: ${searchTypes[extra.mysearch]}🕵️`
        }
        if(typeof(extra.education) == 'number'){
            messageText += `\nМоё образование: ${educationTypes[extra.education]}📚`
        }
        if(typeof(extra.familyplans) == 'number'){
            messageText += `\nМои планы на будущее: ${familyPlansTypes[extra.familyplans]}👪`
        }

        if(typeof(extra.lovelang) == 'number'){
            messageText += `\nМой язык любви: ${loveLangTypes[extra.lovelang]}👻`
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
        if(typeof(extra.socmedia) == 'number'){
            messageText += `\nМоё отношение к СоцСетям: ${socMediaTypes[extra.socmedia]}📱`
        }
        if(typeof(extra.commtype) == 'number'){
            messageText += `\nМой тип общения: ${commTypes[extra.commtype]}💬`
        }
        if(typeof(extra.nightlive) == 'number'){
            messageText += `\nОбраз жизни: ${nightLiveTypes[extra.nightlive]}💤`
        }

    }

    return messageText
}

async function imgUser(ctx) {
    const chatId = String(ctx.chat.id)
    const userimages = await AppDataSource.manager.findOneBy(UserImages, {chatId })
    const folderPath = path.join(__dirname, "..", "photos");

    const mediaGroup = userimages.photoFilenames.map((name) => {
        const fullPath = path.join(folderPath, name);
        return {
            type: "photo",
            media: new InputFile(fs.createReadStream(fullPath)),
        };
    });
    await ctx.api.sendMediaGroup(chatId, mediaGroup); 
}
export {imgUser, msgUser}