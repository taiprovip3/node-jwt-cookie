import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Video } from "./Video.js";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "varchar",unique: true })
    name!: string; // ví dụ: "javascript", "chill"

    @ManyToMany(() => Video, (video) => video.hashTags)
    videos!: Video[];
}