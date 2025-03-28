import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";

/**
 * Ищет пользователей в радиусе от заданной точки
 * @param latitude - широта (lat)
 * @param longitude - долгота (lon)
 * @param radiusInMeters - радиус в метрах
 */
export async function findUsersNearby(
  latitude: number,
  longitude: number,
  radiusInMeters: number,
  excludeChatId: string // ← сюда передаём свой chatId
) {
  const userRepository = AppDataSource.getRepository(User);

  const { entities: users, raw } = await userRepository
    .createQueryBuilder("user")
    .innerJoin("user.location", "location")
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
        excludeChatId: excludeChatId,
      }
    )
    .orderBy("distance", "ASC")
    .getRawAndEntities();

  return users.map((user, index) => ({
    user,
    distance: Number(raw[index].distance),
  }));
}
