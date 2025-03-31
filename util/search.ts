import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { SearchSettings } from "../src/entity/SearchSetting";
import { Location } from "../src/entity/Location";

/**
 * Ищет пользователей в радиусе от заданной точки и фильтрует по настройкам поиска
 * @param latitude - широта (lat)
 * @param longitude - долгота (lon)
 * @param radiusInMeters - радиус в метрах
 * @param excludeChatId - исключаем чатId (свой)
 */


export async function findUsersNearby(user) {
  const chatId = user.chatId
  const userSearchSettings = await AppDataSource.manager.findOneBy(SearchSettings, { chatId }) //настройки поиска пользователя
    const userPoint = await AppDataSource.manager.findOneBy(Location, { chatId }) //локация пользователя
  const latitude = userPoint.location.coordinates[1]
  const longitude = userPoint.location.coordinates[0]
  const radiusInMeters = userSearchSettings.radius
  const excludeChatId = user.chatId

  const userRepository = AppDataSource.getRepository(User);

  // получаем настройки поиска вызывающего пользователя
  const searchSettings = await AppDataSource.getRepository(SearchSettings).findOneBy({ chatId: excludeChatId });
  if (!searchSettings) return [];

  const query = userRepository
    .createQueryBuilder("user")
    .innerJoin("user.location", "location")
    .innerJoin("user.extraInfo", "extraInfo")
    .addSelect(
      `
      ST_Distance(
        location.location,
        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography
      )
      `,
      "distance"
    )
    .where(
      `
      ST_DWithin(
        location.location,
        ST_SetSRID(ST_MakePoint(:lon, :lat), 4326)::geography,
        :radius
      )
      AND user.chatId != :excludeChatId
      `,
      {
        lon: longitude,
        lat: latitude,
        radius: radiusInMeters,
        excludeChatId,
      }
    );

  // динамически добавляем фильтры
  const filterFields = [
    "zodiac", "education", "familyPlans", "persType", "commType",
    "loveLang", "mySearch", "alcohol", "smoke", "gym", "food", "socMedia", "nightLive"
  ];

  for (const field of filterFields) {
    const value = searchSettings[field];
    if (value !== null && value !== undefined) {
      query.andWhere(`extraInfo.${field} = :${field}`, { [field]: value });
    }
  }

  // высота — отдельная история (массив диапазона)
  if (Array.isArray(searchSettings.height) && searchSettings.height.length === 2) {
    const [minHeight, maxHeight] = searchSettings.height;
    query.andWhere("extraInfo.height BETWEEN :minHeight AND :maxHeight", { minHeight, maxHeight });
  }

  // булевы поля — bio, pets, work, language (если true — значит, фильтруем на not null)
  const booleanFields = ["bio", "pets", "work", "language"];
  for (const field of booleanFields) {
    if (searchSettings[field] === true) {
      query.andWhere(`extraInfo.${field} IS NOT NULL`);
    }
  }

  const { entities: users, raw } = await query.orderBy("distance", "ASC").getRawAndEntities();

  return users.map((user, index) => ({
    user,
    distance: Number(raw[index].distance),
  }));
}
