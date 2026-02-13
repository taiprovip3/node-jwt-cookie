import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt-config.js";
import { TokenPayload, TokenPayloadProps } from "../types/TokenPayload.js";
import { TokenType } from "../types/TokenType.js";
import { User } from "../entity/User.js";
import { EmailVerifyPayload } from "../types/EmailVerifyPayload.js";

export const generateAccessToken = (tokenPayloadProps: TokenPayloadProps): string => {
    // Implementation for generating JWT access token
    return jwt.sign(
        tokenPayloadProps,
        jwtConfig.jwtAccessSecret,
        { expiresIn: jwtConfig.accessTokenExpirationTime } as jwt.SignOptions
    );
};

export const generateRefreshToken = (userId: number): string => {
    // Implementation for generating JWT refresh token
    return jwt.sign(
        { userId },
        jwtConfig.jwtRefreshSecret,
        { expiresIn: jwtConfig.refreshTokenExpirationTime } as jwt.SignOptions
    )
};

export const verifyToken = (token: string, type: TokenType) => {
    // Implementation for verifying JWT access token
    switch (type) {
        case TokenType.ACCESS:
            return jwt.verify(token, jwtConfig.jwtAccessSecret) as TokenPayload;
        case TokenType.REFRESH:
            return jwt.verify(token, jwtConfig.jwtRefreshSecret) as TokenPayload;
        default:
            throw new Error("Invalid token type."); // Throw error in application console. Not in response to user.
    }
};

// Hàm tạo ra chuỗi token
export const generateEmailVerificationToken = (user: User): string => {
    const tokenPayloadProps: EmailVerifyPayload = {
        sub: user.id,
        email: user.email!,
        type: "email_verify"
    };
    return jwt.sign(
        tokenPayloadProps,
        jwtConfig.jwtAccessSecret,
        { expiresIn: "24h" } as jwt.SignOptions);
}