import { Column, Entity, PrimaryColumn } from "typeorm";


@Entity()
export class ProfileStack {

    @PrimaryColumn({ type: "bigint" })
    chatId: string

    @Column('jsonb', { nullable: true })
    stack: { chatId: string; distance: number }[]

}