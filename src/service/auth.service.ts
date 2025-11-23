import { userRepository } from "../repository/user.repository";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { jwtConfig } from "../config/jwt-config";

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

    async login(username: string, password: string) {
        const user = await userRepository.findOne({ where: { username } }); 
        console.log('User just logged=', user);

        if (!user) {
            throw new Error("Invalid username or password");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error("Invalid password");
        }

        return {
            status: "success",
            message: "Login successful",
            data: {
                token_type: "Bearer",
                access_token: generateAccessToken(user.id),
                expires_in: jwtConfig.accessTokenExpirationTime,
                refresh_token: generateRefreshToken(user.id),
                user,
            }
        };
    }
    async refreshToken(refreshToken: string) {
        const payload: any = jwt.verify(refreshToken, jwtConfig.jwtRefreshSecret); // verify refresh token
        console.log("What is inside the payload of refreshToken?:", payload);
        const newAccessToken = generateAccessToken(payload.userId);
        return newAccessToken;
    }
}