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

    @Column({type: 'boolean',  default: null })
    text: boolean

    @Column({type: 'boolean',  default: null })
    languages: boolean

    @Column({ type: "int", default: null })
    height: number

    @Column({ type: "int", default: null })
    mysearch: number

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
    socmedia: number

    @Column({ type: "int", default: null })
    nightlive: number

    @OneToOne(() => User, user => user.searchsettings, {
        onDelete: 'CASCADE'
      })
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    user: User;
}