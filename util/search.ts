import { AppDataSource } from "../src/data-source";
import { SearchSettings } from "../src/entity/searchSetting";
import { User } from "../src/entity/User";
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
  booleanTypes } from "./types"
/**
 * Ищет пользователей в радиусе от заданной точки
 * @param latitude - широта (lat)
 * @param longitude - долгота (lon)
 * @param radiusInMeters - радиус в метрах
 */
export async function findUsersNearby(latitude: number, longitude: number, radiusInMeters: number) {
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository
    .createQueryBuilder("user")
    .where(
      `ST_DWithin(user.location, ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography, :radius)`,
      {
        lon: longitude,
        lat: latitude,
        radius: radiusInMeters,
      }
    )
    .getMany();

  return users;
}

export async function msgSearch(ctx) {
    const chatId = String(ctx.chat.id);
    let settings = await AppDataSource.getRepository(SearchSettings).findOneBy({ chatId });

    if(!settings){
      settings = new SearchSettings();
      settings.chatId = chatId
      await AppDataSource.manager.save(settings)
    }

    let messageText = (`Твои данные для поиска:\nВозраст от ${settings.age[0]} до ${settings.age[1]}\nРадиус поиска ${((settings.radius)/1000)} км`)
    if(typeof(settings.text) == 'boolean'){
      messageText += `\nНаличие био: ${booleanTypes[settings.text.toString()]}`
    }
    if(settings.languages){
      messageText += `\nНаличие языков📖: ${booleanTypes[String(settings.languages)]}`
    }
    if(typeof(settings.zodiacsign) == 'number'){
      messageText += `\nЗнак зодиака: ${zodiacTypes[settings.zodiacsign]}🔮`
    }
    if(settings.height){
        messageText += `\nРост: ${settings.height}📏`
    }
    if(typeof(settings.perstype) == 'number'){
        messageText += `\nТип личности: ${persTypes[settings.perstype]}♟️`
    }
    if(typeof(settings.mysearch) == 'number'){
        messageText += `\nИщет: ${searchTypes[settings.mysearch]}🕵️`
    }
    if(typeof(settings.education) == 'number'){
        messageText += `\nОбразование: ${educationTypes[settings.education]}📚`
    }
    if(typeof(settings.familyplans) == 'number'){
        messageText += `\nПланы на будущее: ${familyPlansTypes[settings.familyplans]}👪`
    }

    if(typeof(settings.lovelang) == 'number'){
        messageText += `\nЯзык любви: ${loveLangTypes[settings.lovelang]}👻`
    }
    if(typeof(settings.work) == 'string'){
        messageText += `\nНаличие работы: ${booleanTypes[String(settings.work)]}🏭`
    }
    if(typeof(settings.pets) == 'string'){
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
    if(typeof(settings.socmedia) == 'number'){
        messageText += `\nОтношение к СоцСетям: ${socMediaTypes[settings.socmedia]}📱`
    }
    if(typeof(settings.commtype) == 'number'){
        messageText += `\nТип общения: ${commTypes[settings.commtype]}💬`
    }
    if(typeof(settings.nightlive) == 'number'){
        messageText += `\nОбраз жизни: ${nightLiveTypes[settings.nightlive]}💤`
    }
  return messageText
}
