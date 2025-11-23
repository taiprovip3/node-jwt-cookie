import { userRepository } from "../repository/user.repository";
import bcrypt from "bcryptjs";

export class AuthService {
    async register(username: string, password: string) {
        const hookExistedUser = await userRepository.findOne({ where: { username } });
        if (hookExistedUser) {
            throw new Error("Username already exists");
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        
        const user = userRepository.create({
            username,
            password: passwordHashed,
        });

        return await userRepository.save(user);
    }
}