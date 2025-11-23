import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm";
import { Profile } from "./Profile";
import { Role } from "./Role";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column()
    password!: string;

    @Column({ nullable: true })
    email?: string;

    @Column({ default: false })
    isEmailVerified!: boolean;

    @Column({ default: false })
    isDisabled!: boolean;

    @Column({ default: true })
    accountNonExpired!: boolean;

    @Column({ default: true })
    credentialsNonExpired!: boolean;

    @Column({ default: true })
    accountNonLocked!: boolean;

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    @JoinColumn()
    profile!: Profile | null;

    @ManyToOne(() => Role, (role) => role.users, { eager: true }) // eager: true → mỗi lần load User sẽ tự động load role (tiện cho auth).
    role!: Role;

    constructor() {
        this.profile = null;
        this.role = { id: 1 } as Role; // Mặc định mỗi user mới sẽ có role là "USER".
    }
}