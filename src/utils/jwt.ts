import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt-config";

export const generateAccessToken = (userId: number): string => {
    // Implementation for generating JWT access token
    return jwt.sign(
        { userId },
        jwtConfig.jwtAccessSecret,
        { expiresIn: jwtConfig.accessTokenExpirationTime } as jwt.SignOptions
    );
};

export const verifyAccessToken = (token: string, secret: string) => {
    // Implementation for verifying JWT access token
};

export const generateRefreshToken = (userId: number): string => {
    // Implementation for generating JWT refresh token
    return jwt.sign(
        { userId },
        jwtConfig.jwtRefreshSecret,
        { expiresIn: jwtConfig.refreshTokenExpirationTime } as jwt.SignOptions
    )
};