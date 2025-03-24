import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Report } from "./entity/Report"
// import { extraInfo } from "./entity/ExtraInfo"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5434,
    username: "postgres",
    password: "postgres",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
