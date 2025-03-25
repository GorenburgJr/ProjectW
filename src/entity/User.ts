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

    @Column({default:false})
    inSearch: boolean

    @OneToOne(() => extraInfo, extra => extra.user,  { cascade: true, onDelete: 'CASCADE' })
    extraInfo?: extraInfo;

    @OneToOne(() => Location, location => location.user,  { cascade: true, onDelete: 'CASCADE' })
    location?: Location;

}
