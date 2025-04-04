import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class BanList{
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: 'bigint'})
    bannedId: string

    @Column()
    reason: string

    @Column({type: 'date'})
    date: Date

    @Column({type: 'bigint'})
    adminId: string
}