import { userRepository } from "../repository/user.repository.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
import { jwtConfig } from "../config/jwt-config.js";
import { TokenPayload, TokenPayloadProps } from "../types/TokenPayload.js";
import { TokenType } from "../types/TokenType.js";
import { getEnv } from "../utils/env.js";
import ms, { StringValue } from "ms";
import { UserService } from "./user.service.js";

const userService = new UserService();
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

        const expiresInRaw = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
        const expiresInMs = ms(expiresInRaw);
        if (!expiresInMs) {
            throw new Error('Invalid JWT_ACCESS_TOKEN_EXPIRATION_TIME');
        }
        const accessTokenExpiresAt = Date.now() + expiresInMs;
        
        return {
            token_type: "Bearer",
            access_token: generateAccessToken({ userId: user.id, userRole: (await user.role).name }), // Pass payloadProps
            expires_in: jwtConfig.accessTokenExpirationTime,
            expires_at: accessTokenExpiresAt,
            refresh_token: generateRefreshToken(user.id),
            user,
        };
    }

    async refreshToken(refreshToken: string) {
        const { userId } = verifyToken(refreshToken, TokenType.REFRESH) as TokenPayloadProps;
        const user = await userService.getUserData(userId);
        if (!user) {
            throw new Error(`User not found with user id ${userId}`);
        }
        const newAccessToken = generateAccessToken({userId, userRole: (await user.role).name});
        const newRefreshToken = generateRefreshToken(userId);
        const pairToken = {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }
        return pairToken;
    }

    async whoimi(userId: number) {
        const user = await userRepository.findOne({ where: { id: userId } }); 
        if (!user) {
            throw new Error(`Not found user with user id ${userId}`);
        }
    }
}