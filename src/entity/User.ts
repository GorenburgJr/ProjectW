import { Entity, PrimaryGeneratedColumn, Column, Unique} from "typeorm"

@Entity()
@Unique(["chatId"])
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "bigint" })
    chatId: string

    @Column()
    name: string

    @Column()
    age: number

    @Column()
    regPassed: boolean
}
