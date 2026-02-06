import { DataSource } from "typeorm";
import { Address } from "../entity/Address.js";
import { Profile } from "../entity/Profile.js";
import { Role } from "../entity/Role.js";
import { User } from "../entity/User.js";
import { Tag } from "../entity/Tag.js";
import { Video } from "../entity/Video.js";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Address, Profile, Role, User, Video, Tag],
    migrations: [], // migrations: ["src/database/migrations/**/*.ts"]
});