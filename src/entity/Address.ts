import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Profile } from "./Profile.js";

@Entity()
export class Address {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar" })
    fullname!: string;

    @Column({ type: "varchar" })
    phoneNumber!: string;

    @Column({ type: "varchar" })
    countryCode!: string;

    @Column({type: "varchar" })
    address!: string;

    @ManyToOne(() => Profile, (profile) => profile.addresses)
    profile!: Profile;
}