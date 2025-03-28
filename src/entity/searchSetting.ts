import { Entity,  Column, OneToOne, PrimaryColumn,JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class SearchSettings {

    @PrimaryColumn({ type: "bigint" })
    chatId: string

    @Column("text", { array: true, default: [18, 20] })
    age: number[];

    @Column({ type: "int", default: 2000 })
    radius: number;

    @Column({ type: "int", default: null })
    zodiac: number

    @Column({ type: "int", default: null })
    education: number

    @Column({ type: "int", default: null })
    familyPlans: number

    @Column({ type: "int", default: null })
    persType: number

    @Column({ type: "int", default: null })
    commType: number

    @Column({ type: "int", default: null })
    loveLang: number

    @Column({type: 'boolean',  default: null })
    bio: boolean

    @Column({type: 'boolean',  default: null })
    language: boolean

    @Column('int', { array: true, default: null })
    height: number[]

    @Column({ type: "int", default: null })
    mySearch: number

    @Column({type: 'boolean', default: null })
    work: boolean

    @Column({ type: "boolean", default: null })
    pets: boolean

    @Column({ type: "int", default: null })
    alcohol: number

    @Column({ type: "int", default: null })
    smoke: number

    @Column({ type: "int", default: null })
    gym: number

    @Column({ type: "int", default: null })
    food: number

    @Column({ type: "int", default: null })
    socMedia: number

    @Column({ type: "int", default: null })
    nightLive: number

    @OneToOne(() => User, user => user.searchsettings, {
        onDelete: 'CASCADE'
      })
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    user: User;
}