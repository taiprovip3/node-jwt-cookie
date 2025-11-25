import { AppDataSource } from "../config/data-source.js";
import { User } from "../entity/User.js";

export const userRepository = AppDataSource.getRepository(User);