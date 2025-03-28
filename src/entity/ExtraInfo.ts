import { Entity,  Column, OneToOne, PrimaryColumn,JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class extraInfo {

    @PrimaryColumn({ type: "bigint" })
    chatId: string

    @Column({ type: "int", default: null })
    zodiacsign: number

    @Column({ type: "int", default: null })
    education: number

    @Column({ type: "int", default: null })
    familyplans: number

    @Column({ type: "int", default: null })
    perstype: number

    @Column({ type: "int", default: null })
    commtype: number

    @Column({ type: "int", default: null })
    lovelang: number

    @Column({ type: "varchar", default: null })
    text: string

    @Column({ type: "varchar", default: null })
    languages: string

    @Column({ type: "int", default: null })
    height: number

    @Column({ type: "int", default: null })
    mysearch: number

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
    socmedia: number

    @Column({ type: "int", default: null })
    nightlive: number

    @OneToOne(() => User, user => user.extraInfo, {
        onDelete: 'CASCADE'
      })
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    user: User;
}