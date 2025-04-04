import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Report {

    @PrimaryGeneratedColumn()
    report_id: number

    @Column({type: 'bigint'})
    reportedUserId: string

    @Column({type: 'bigint'})
    sendedUserId: string

    @Column()
    reasonId: number

    @Column({ type: 'date', nullable: true})
    date: Date

    @Column({default: 'false'})
    checked: boolean

}