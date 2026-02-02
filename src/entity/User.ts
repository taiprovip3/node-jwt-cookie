import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Profile } from "./Profile.js";
import { Role } from "./Role.js";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar", unique: true })
    username!: string;

    @Column({ type: "varchar" })
    password!: string;

    @Column({ type: "varchar", nullable: true })
    email?: string;

    @Column({ type: "boolean", default: false })
    isEmailVerified!: boolean;

    @Column({ type: "boolean", default: false })
    isDisabled!: boolean;

    @Column({ type: "boolean", default: true })
    accountNonExpired!: boolean;

    @Column({ type: "boolean", default: true })
    credentialsNonExpired!: boolean;

    @Column({ type: "boolean", default: true })
    accountNonLocked!: boolean;

    @CreateDateColumn({
        nullable: true,
        type: 'text', // Xác định kiểu dữ liệu trong DB là TEXT (Phù hợp với SQLite),
    })
    createdAt!: string;

    @UpdateDateColumn({
        nullable: true,
        type: 'text' // Xác định kiểu dữ liệu trong DB là TEXT
    })
    updatedAt!: string;

    @OneToOne(() => Profile, { cascade: true, eager: true, nullable: true })
    @JoinColumn()
    profile!: Profile | null;

    @ManyToOne(() => Role, (role) => role.users, { eager: true }) // eager: true → mỗi lần load User sẽ tự động load role (tiện cho auth).
    role!: Promise<Role> | Role;

    constructor() {
        this.profile = null;
        this.role = { id: 1 } as Role; // Mặc định mỗi user mới sẽ có role là "USER".
    }
}