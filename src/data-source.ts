import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Report } from "./entity/Report"
import { ExtraInfo } from "./entity/ExtraInfo"
import { Location } from "./entity/Location"
import { UserImages } from "./entity/UserImages"
import { SearchSettings } from "./entity/SearchSetting"
import * as dotenv from 'dotenv'
import { ProfileStack } from "./entity/profileStack"
import { Reactions } from "./entity/Reactions"
import { Letter } from "./entity/Letters"

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: process.env.DATA_BASE_USER,
    password: process.env.DATA_BASE_PWD,
    database: "teledb",
    synchronize: true,
    logging: false,
    entities: [User, 
        ExtraInfo, 
        Location,
        Report, 
        UserImages, 
        SearchSettings,
        ProfileStack,
        Reactions,
        Letter
    ],
    migrations: [],
    subscribers: [],
})
