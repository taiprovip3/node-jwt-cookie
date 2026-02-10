import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Role } from "./Role.js";
import { User } from "./User.js";

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", unique: true })
  code!: string; // vd: feature.export_pdf

  @Column({ type: "varchar" })
  description!: string;

  @ManyToMany(() => Role, role => role.permissions)
  roles!: Role[];

  @ManyToMany(() => User, user => user.permissions)
  users!: User[];
}