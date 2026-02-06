import { userRepository } from "../repository/user.repository.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
import { jwtConfig } from "../config/jwt-config.js";
import { TokenPayload } from "../types/TokenPayload.js";
import { TokenType } from "../types/TokenType.js";
export class AuthService {
    
    async register(username: string, password: string) {
        const searchUser = await userRepository.findOne({ where: { username } });
        if (searchUser) {
            throw new Error("Username already exists."); // Unexpected error -> throw Error. Expedted error -> throw CustomThrowError
        }

        const passwordHashed = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            username,
            password: passwordHashed,
        });

        return await userRepository.save(user);
    }

    async login(username: string, password: string) {
        const user = await userRepository.findOne({ where: { username } }); 
        
        if (!user) {
            throw new Error("Invalid username or password.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password.");
        }

        return {
            token_type: "Bearer",
            access_token: generateAccessToken({ userId: user.id, userRole: (await user.role).name }), // Pass payloadProps
            expires_in: jwtConfig.accessTokenExpirationTime,
            refresh_token: generateRefreshToken(user.id),
            user,
        };
    }

    async refreshToken(refreshToken: string) {
        const payload = verifyToken(refreshToken, TokenType.REFRESH) as TokenPayload;
        const newAccessToken = generateRefreshToken(payload.userId);
        return newAccessToken;
    }
}