import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Reactions {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint' })
    fromUser: string

    @Column({ type: 'bigint' })
    toUser: string

    @Column({ type: 'boolean' })
    reactionType: boolean//false дизлайк true лайк

    @Column({ type: 'date' })
    date: Date
}