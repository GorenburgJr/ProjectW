import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm"
import { extraInfo } from "./ExtraInfo"
import { Location } from "./Location"

@Entity()
@Unique(["chatId"])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "bigint" })
    chatId: string

    @Column()
    name: string

    @Column()
    age: number

    @Column({default: true})
    sex: boolean

    @Column({default: null})
    sexSearch: boolean

    @Column()
    regPassed: boolean

    @OneToOne(() => extraInfo, extra => extra.user)
    extraInfo?: extraInfo;

    @OneToOne(() => Location, location => location.user)
    location?: Location;

}
