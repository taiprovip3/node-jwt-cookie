import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { User } from "./User.js";
import { Permission } from "./Permission.js";

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

    @ManyToMany(() => Permission, (permission) => permission.roles, { lazy: true })
    @JoinTable({ name: "role_permissions"  })
    permissions!: Promise<Permission[]>; // Do lazy
}