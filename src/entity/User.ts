import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToOne, JoinColumn } from "typeorm"
import { extraInfo } from "./ExtraInfo"
import { Location } from "./Location"
import { UserImages } from "./UserImages"
import { SearchSettings } from "./SearchSetting"

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

    @Column({default: 0})
    sex: number

    @Column({default: 0})
    sexSearch: number

    @Column({default:false})
    inSearch: boolean

    @Column({default:false})
    regPassed: boolean

    @OneToOne(() => extraInfo, extra => extra.user,  { cascade: true, onDelete: 'CASCADE' })
    extraInfo?: extraInfo;

    @OneToOne(() => Location, location => location.user,  { cascade: true, onDelete: 'CASCADE' })
    location?: Location;

    @OneToOne(() => UserImages, userimages => userimages.user,  { cascade: true, onDelete: 'CASCADE' })
    userimages?: UserImages;

    @OneToOne(() => SearchSettings, searchsettings => searchsettings.user,  { cascade: true, onDelete: 'CASCADE' })
    searchsettings?: SearchSettings;

}
