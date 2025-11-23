import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { User } from "./User";

export enum RoleName {
    USER = "USER",
    MODERATOR = "MODERATOR",
    ADMIN = "ADMIN",
}

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        type: "text",
        unique: true,
    })
    name!: RoleName;

    @OneToMany(() => User, (user) => user.role) // Mối quan hệ 2 chiều giúp cho chức năng ADMIN dò ra những user nào có role "USER", hoặc "MODERATOR", "ADMIN".
    users!: User[];
}