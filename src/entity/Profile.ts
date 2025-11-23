import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany } from "typeorm";
import { Address } from "./Address";
import { User } from "./User";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: true })
    fullname?: string;

    @Column({ nullable: true })
    phoneNumber?: string;

    @Column()
    phoneCode!: string;

    @Column({ nullable: true })
    gender?: string;

    @Column({ nullable: true })
    dateOfBirth?: string;

    @Column({ default: 0 })
    balance!: number;

    @Column({ nullable: true })
    defaultAddress?: string;

    @Column({ default: "" })
    avatarUrl!: string;

    @Column({ default: "" })
    bio!: string;

    @Column()
    createdAt!: string;

    @Column()
    updatedAt!: string;

    @OneToMany(() => Address, (address) => address.profile, { cascade: true })
    addresses!: Address[];

    @OneToOne(() => User, (user) => user.profile)
    user!: User;
}