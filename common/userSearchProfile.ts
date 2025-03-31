import { AppDataSource } from "../src/data-source";
import { SearchSettings } from "../src/entity/SearchSetting";
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
  booleanTypes } from "../util/types"

export async function msgSearch(ctx) {
    const chatId = String(ctx.chat.id);
    let settings = await AppDataSource.getRepository(SearchSettings).findOneBy({ chatId });

    if(!settings){
      settings = new SearchSettings();
      settings.chatId = chatId
      await AppDataSource.manager.save(settings)
    }

    let messageText = (`Твои данные для поиска:\nВозраст от ${settings.age[0]} до ${settings.age[1]}\nРадиус поиска ${((settings.radius)/1000)} км`)
    if(typeof(settings.bio) == 'boolean'){
      messageText += `\nНаличие био: ${booleanTypes[settings.bio.toString()]}`
    }
    if(typeof(settings.language) == 'boolean'){
      messageText += `\nНаличие языков📖: ${booleanTypes[String(settings.language)]}`
    }
    if(typeof(settings.zodiac) == 'number'){
      messageText += `\nЗнак зодиака: ${zodiacTypes[settings.zodiac]}🔮`
    }
    if(settings.height){
        messageText += `\nРост: ${settings.height}📏`
    }
    if(typeof(settings.persType) == 'number'){
        messageText += `\nТип личности: ${persTypes[settings.persType]}♟️`
    }
    if(typeof(settings.mySearch) == 'number'){
        messageText += `\nИщет: ${searchTypes[settings.mySearch]}🕵️`
    }
    if(typeof(settings.education) == 'number'){
        messageText += `\nОбразование: ${educationTypes[settings.education]}📚`
    }
    if(typeof(settings.familyPlans) == 'number'){
        messageText += `\nПланы на будущее: ${familyPlansTypes[settings.familyPlans]}👪`
    }

    if(typeof(settings.loveLang) == 'number'){
        messageText += `\nЯзык любви: ${loveLangTypes[settings.loveLang]}👻`
    }
    if(typeof(settings.work) == 'boolean'){
        messageText += `\nНаличие работы: ${booleanTypes[String(settings.work)]}🏭`
    }
    if(typeof(settings.pets) == 'boolean'){
        messageText += `\nНаличие питомца(ев): ${booleanTypes[String(settings.pets)]}🐈`
    }
    if(typeof(settings.alcohol) == 'number'){
        messageText += `\nОтношение к алкоголю: ${alcoTypes[settings.alcohol]}🥃`
    }
    if(typeof(settings.smoke) == 'number'){
        messageText += `\nОтношение к курению: ${smokeTypes[settings.smoke]}🚬`
    }
    if(typeof(settings.gym) == 'number'){
        messageText += `\nОтношение к спорту: ${gymTypes[settings.gym]}🏋️‍♀️`
    }
    if(typeof(settings.food) == 'number'){
        messageText += `\nОтношение к питанию: ${foodTypes[settings.food]}🍔`
    }
    if(typeof(settings.socMedia) == 'number'){
        messageText += `\nОтношение к СоцСетям: ${socMediaTypes[settings.socMedia]}📱`
    }
    if(typeof(settings.commType) == 'number'){
        messageText += `\nТип общения: ${commTypes[settings.commType]}💬`
    }
    if(typeof(settings.nightLive) == 'number'){
        messageText += `\nОбраз жизни: ${nightLiveTypes[settings.nightLive]}💤`
    }
  return messageText
}
