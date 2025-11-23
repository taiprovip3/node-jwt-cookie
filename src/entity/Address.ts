import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Profile } from "./Profile";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fullname!: string;

    @Column()
    phoneNumber!: string;

    @Column()
    countryCode!: string;

    @Column()
    address!: string;

    @ManyToOne(() => Profile, (profile) => profile.addresses)
    profile!: Profile;
}