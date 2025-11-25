import jwt from "jsonwebtoken";
import { jwtConfig } from "../config/jwt-config.js";
import { TokenPayload, TokenPayloadProps } from "../types/TokenPayload.js";
import { TokenType } from "../types/TokenType.js";

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

/**
 * @param token // the JWT token to verify
 * @param type // type of the token: ACCESS or REFRESH
 * @returns // TokenPayload if the token is valid
 */
export const verifyToken = (token: string, type: TokenType ) => {
    // Implementation for verifying JWT access token
    switch (type) {
        case TokenType.ACCESS:
            return jwt.verify(token, jwtConfig.jwtAccessSecret) as TokenPayload;
        case TokenType.REFRESH:
            return jwt.verify(token, jwtConfig.jwtRefreshSecret) as TokenPayload;
        default:
            throw new Error("Invalid token type");
    }
};