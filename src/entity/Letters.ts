import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Letter{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'bigint'})
    fromUser: string

    @Column({type: 'bigint'})
    toUser: string

    @Column()
    text: string

    @Column()
    distance: number
}