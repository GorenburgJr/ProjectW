import { Entity,  Column, OneToOne, PrimaryColumn,JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class UserImages {

    @PrimaryColumn({type: 'bigint'})
    chatId: string

    @Column("text", { array: true })
  photoFilenames: string[];

  @OneToOne(() => User, user => user.userimages, {
    onDelete: 'CASCADE'
  })
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    user: User;
}