import { DataSource } from "typeorm";
import { Address } from "../entity/Address.js";
import { Profile } from "../entity/Profile.js";
import { Role } from "../entity/Role.js";
import { User } from "../entity/User.js";
import { Permission } from "../entity/Permission.js";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "database.sqlite",
    synchronize: true,
    logging: false,
    entities: [Address, Profile, Role, User, Permission],
    migrations: [], // migrations: ["src/database/migrations/**/*.ts"]
});