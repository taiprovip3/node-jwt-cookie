import { AppDataSource } from "../config/data-source.js";
import { Profile } from "../entity/Profile.js";

export const profileRepository = AppDataSource.getRepository(Profile);