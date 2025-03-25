import { Entity,  Column, OneToOne, JoinColumn, PrimaryColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Location{

    @PrimaryColumn({ type: 'bigint' }) // или @Column({ unique: true })
    chatId: string;

    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location: {
        type: 'Point',
        coordinates: [number, number];
    };

    @OneToOne(() => User, user => user.location,{
        onDelete: 'CASCADE'
      })
    @JoinColumn({ name: 'chatId', referencedColumnName: 'chatId' })
    user: User;

}