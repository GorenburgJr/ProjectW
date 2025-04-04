import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class Roles {
    @PrimaryColumn({ type: 'bigint'})
    chatId: string

    @Column()
    role: number
}