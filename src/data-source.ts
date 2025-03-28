import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Report } from "./entity/Report"
import { extraInfo } from "./entity/ExtraInfo"
import { Location } from "./entity/Location"
import { UserImages } from "./entity/UserImages"
import { SearchSettings } from "./entity/SearchSetting"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "gorenburgjr",
    password: "gorenburgjr",
    database: "teledb",
    synchronize: true,
    logging: false,
    entities: [User, extraInfo, Location, Report, UserImages, SearchSettings],
    migrations: [],
    subscribers: [],
})
