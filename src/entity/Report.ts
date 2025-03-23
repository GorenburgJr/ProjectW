import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class Report {

    @PrimaryGeneratedColumn()
    report_id: number

    @Column()
    reportedUserId: number

    @Column()
    sendedUserId: number

    @Column()
    reasonId: number

}