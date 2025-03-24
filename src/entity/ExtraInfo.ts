import { Entity, JoinColumn, Column, OneToOne } from "typeorm"
import { User } from "./User"

@Entity()
export class extraInfo {

    @OneToOne(() => User)
    @JoinColumn()
    chatID: User

    @Column()
    zodiacsign: number

    @Column()
    education: number

    @Column()
    kidswish: number

    @Column()
    perstype: number

    @Column()
    commstyle: number

    @Column()
    lovelang: number

    @Column()
    text: string

    @Column()
    languages: number

    @Column()
    height: number

    @Column()
    my_search: number

    @Column()
    work: number

    @Column()
    pets: number

    @Column()
    alcohol: number

    @Column()
    smoke: number

    @Column()
    gym: number

    @Column()
    food: number

    @Column()
    socmedia: number

    @Column()
    nightlive: number


}