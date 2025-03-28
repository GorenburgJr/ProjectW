import { Entity,  Column, OneToOne, PrimaryColumn,JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class extraInfo {

    @PrimaryColumn({ type: "bigint" })
    chatId: string

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

    @Column({ type: "varchar", default: null })
    bio: string

    @Column({ type: "varchar", default: null })
    language: string

    @Column({ type: "int", default: null })
    height: number

    @Column({ type: "int", default: null })
    mySearch: number

    @Column({ type: "varchar", default: null })
    work: string

    @Column({ type: "varchar", default: null })
    pets: string

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

    @OneToOne(() => User, user => user.extraInfo, {
        onDelete: 'CASCADE'
      })
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    user: User;
}