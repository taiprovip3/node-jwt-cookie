import jwt, { JwtPayload } from "jsonwebtoken";
import { userRepository } from "../repository/user.repository.js";
import bcrypt from "bcryptjs";
import { TokenPayloadProps } from "../types/TokenPayload.js";
import { TokenType } from "../types/TokenType.js";
import { UserService } from "./user.service.js";
import { CustomThrowError } from "../types/CustomThrowError.js";
import { buildOAuth2Response } from "../helpers/auth.helper.js";
import { deliveryMailByNodeMailer } from "../utils/node-mailer.util.js";
import { EmailVerifyPayload } from "../types/EmailVerifyPayload.js";
import { jwtConfig } from "../config/jwt-config.js";
import { generateAccessToken, generateRefreshToken, verifyToken, generateEmailVerificationToken } from "../utils/jwt.util.js";

interface ChangePasswordInput {
  userId: number
  oldPassword: string
  newPassword: string
}

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

        const accessToken = generateAccessToken({ userId: user.id, userRole: user.role.name });
        const refreshToken = generateRefreshToken(user.id);
        const responseData = buildOAuth2Response(accessToken);

        return { responseData, accessToken, refreshToken };
    }

    async refresh(refreshToken: string) {
        const { userId } = verifyToken(refreshToken, TokenType.REFRESH) as TokenPayloadProps;
        const user = await userService.getUserFrom('ID', userId);
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

    async getMe(userId: number) {
        const user = await userRepository.findOne({ where: { id: userId } }); 
        if (!user) {
            throw new Error(`Not found user with user id ${userId}`);
        }
    }

    async changePassword(input: ChangePasswordInput) {
        const { userId, oldPassword, newPassword } = input;
        const user = await userRepository.findOne({
            where: { id: userId },
        });
        if (!user) {
            throw new CustomThrowError("CHANGE_PASSWORD", "User not found.", 404);
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password)
        if (!isMatch) {
            throw new CustomThrowError("CHANGE_PASSWORD", "Old password is incorrect.", 400);
        }
        const isSamePassword = await bcrypt.compare(newPassword, user.password)
        if (isSamePassword) {
            throw new CustomThrowError("CHANGE_PASSWORD", "New password must be different from old password.", 400);
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await userRepository.save(user);
    }

    async sendEmailVerification(userId: number) {
        const user = await userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("User not found!");
        }
        if(!user.email) {
            throw new Error("User has no email to verify!");
        }
        if (user.isEmailVerified) {
            throw new Error("Email already verified!");
        }
        const token: string = generateEmailVerificationToken(user);
        const info = await deliveryMailByNodeMailer(user.email, token);
        console.log('info=', info);
        
    }

    async verifyEmailBackLink(token: string) {
        let payload: unknown;
        try {
            payload = jwt.verify(token, jwtConfig.jwtAccessSecret);
        } catch {
            throw new CustomThrowError("VERIFY_EMAIL", "Invalid or expired token", 400);
        }
        if(!this.isEmailVerifyPayload(payload)) {
            throw new CustomThrowError("VERIFY_EMAIL", "Invalid token payload", 400);
        }
        const user = await userRepository.findOneBy({ id: payload.sub });
        if (!user) {
            throw new CustomThrowError("VERIFY_EMAIL", "Invalid token type", 400);
        }
        if (user.isEmailVerified) {
            throw new CustomThrowError("VERIFY_EMAIL", "Email already verified", 400);
        }
        user.isEmailVerified = true;
        user.emailVerifiedDate = new Date();
        await userRepository.save(user);
        return { message: "Email verified successfully" };
    }

    /**util fuction */
    isEmailVerifyPayload(payload: unknown): payload is EmailVerifyPayload {
        if (typeof payload !== "object" || payload === null) {
            return false;
        }
        const p = payload as Partial<JwtPayload & EmailVerifyPayload>;
        return (
            p.type === "email_verify" &&
            typeof p.sub === "number" &&
            typeof p.email === "string"
        );
    }
}
