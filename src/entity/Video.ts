import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryColumn } from "typeorm";
import { Tag } from "./Tag.js";
import { Profile } from "./Profile.js";

@Entity()
export class Video {

    @PrimaryColumn({ type: "varchar" })
    id!: string;
    @Column({ type: "varchar" })
    title!: string;
    @Column({ type: "varchar", nullable: true })
    url!: string;
    @Column({ type: "varchar", nullable: true })
    presignedUrl!: string;

    @Column({ type: "integer", default: 0 })
    view!: number;
    @Column({ type: "integer", default: 0 })
    likes!: number;
    @Column({ type: "integer", default: 0 })
    dislikes!: number;
    @Column({ type: "float", default: 0.0 })
    rate!: number;

    @CreateDateColumn({
        nullable: true,
        type: 'text', // Xác định kiểu dữ liệu trong DB là TEXT (Phù hợp với SQLite),
    })
    uploadedAt!: Date;

    @ManyToOne(() => Profile, (profile) => profile.videos)
    uploader!: Profile;

    @ManyToMany(() => Tag, (tag) => tag.videos, { cascade: true })
    @JoinTable({ name: "video_hash_tags" }) // Bảng trung gian sẽ tự động được tạo ra ở đây
    hashTags!: Tag[];
}