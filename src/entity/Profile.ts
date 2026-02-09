import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Address } from "./Address.js";
import { Video } from "./Video.js";
import { getEnv } from "../utils/env.util.js";

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", nullable: true })
    fullname?: string;

    @Column({ type: "varchar", nullable: true })
    phoneNumber?: string;

    @Column({ type: "varchar" })
    phoneCode!: string;

    @Column({ type: "varchar", nullable: true })
    gender?: string;

    @Column({ type: "varchar", nullable: true })
    dateOfBirth?: string;

    @Column({ type: "double", default: 0 })
    balance!: number;

    @Column({ type: "varchar", nullable: true })
    defaultAddress?: string;

    @Column({ type: "varchar", default: getEnv('DEFAULT_PROFILE_AVATAR_URL') })
    avatarUrl!: string;

    @Column({ type: "text", default: "" })
    bio!: string;

    @CreateDateColumn({
        nullable: true,
        type: 'text',
    })
    createdAt!: string;

    @UpdateDateColumn({
        nullable: true,
        type: 'text',
    })
    updatedAt!: string;

    @OneToMany(() => Address, (address) => address.profile)
    addresses!: Promise<Address[]>;

    @OneToMany(() => Video, (video) => video.uploader)
    videos!: Promise<Video[]>;
}