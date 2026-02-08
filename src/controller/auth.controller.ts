import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";
import { RequestHandler } from "../utils/response-handler.js";
import { CustomThrowError } from "../types/CustomThrowError.js";
import { generateAccessToken, generateRefreshToken, verifyToken } from "../utils/jwt.js";
import { TokenType } from "../types/TokenType.js";
import { TokenPayload } from "../types/TokenPayload.js";
import { getEnv } from "../utils/env.js";
import ms, { StringValue } from "ms";
import { jwtConfig } from "../config/jwt-config.js";
import { UserService } from "../service/user.service.js";

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
    
    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            if(!username || !password) {
                throw new CustomThrowError("REGISTER", "Username or password is invalid.", 400, "INVALID_INPUT");
            }
            const user = await authService.register(username, password);
            return RequestHandler.success(res, "REGISTER", user, "User registered successfully.", 201);
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "REGISTER", (error as Error).message, 400);
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            if(!username || !password) {
                throw new CustomThrowError("LOGIN", "Username or password is missing or invalid.", 400, "INVALID_INPUT");
            }
            const accessTokenExpiresValue = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
            const refreshTokenExpiredValue = getEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME') as StringValue;
            const oauth2Response = await authService.login(username, password);
            res.cookie("access_token", oauth2Response.access_token, {
                httpOnly: true,
                signed: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: ms(accessTokenExpiresValue), // 15 minutes
            });
            res.cookie("refresh_token", oauth2Response.refresh_token, {
                httpOnly: true,
                signed: true,
                secure: process.env.NODE_ENV === "production", // trả về true nếu .env set là production. Nếu dùng https thì hãy chỉnh sửa `NODE_ENV` trong .env thành thành production
                sameSite: "lax",
                path: "/api/auth/",
                maxAge: ms(refreshTokenExpiredValue), // 7 days
            });
            oauth2Response['refresh_token'] = 'token was saved in cookie!';
            return RequestHandler.success(res, "LOGIN", oauth2Response, "User logged in successfully.");
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "LOGIN", (error as Error).message, 401);
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const refreshToken = req.signedCookies.refresh_token;
            if (!refreshToken) {
                throw new CustomThrowError("REFRESH_TOKEN", "Refresh token is missing.", 401, "TOKEN_MISSING");
            }

            // create new access token
            const newPairToken = await authService.refreshToken(refreshToken);

            const accessTokenExpiresValue = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
            const refreshTokenExpiredValue = getEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME') as StringValue;
            res.cookie("access_token", newPairToken.accessToken, {
                httpOnly: true,
                signed: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: ms(accessTokenExpiresValue), // 15 minutes
            });
            res.cookie("refresh_token", newPairToken.refreshToken, {
                httpOnly: true,
                signed: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/api/auth/",
                maxAge: ms(refreshTokenExpiredValue), // 7 days
            });
            const expiresInRaw = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
            const expiresInMs = ms(expiresInRaw);
            if (!expiresInMs) {
                throw new Error('Invalid JWT_ACCESS_TOKEN_EXPIRATION_TIME');
            }
            const accessTokenExpiresAt = Date.now() + expiresInMs;
            const tokenInfoResponse = {
                token_type: "Bearer",
                access_token: newPairToken.accessToken, // Pass payloadProps
                expires_in: jwtConfig.accessTokenExpirationTime,
                expires_at: accessTokenExpiresAt,
                refresh_token: 'token was saved in cookie!',
            }
            return RequestHandler.success(res, "REFRESH_TOKEN", tokenInfoResponse, "Access token refreshed successfully.");
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "REFRESH_TOKEN", (error as Error).message, 401);
        }
    }

    logout(req: Request, res: Response) {
        res.clearCookie("access_token", {
            path: "/",
        });
        res.clearCookie("refresh_token", {
            path: "/api/auth/",
        });
        return RequestHandler.success(res, "LOGOUT", null, "User logged out successfully.");
    }

    async me(req: Request, res: Response) {
        const token = req.signedCookies['access_token'] || req.headers['authorization']?.toString().replace('Bearer ', ''); // Cần làm rõ 3 TH token: Có hoặc không | Đúng định dạng | Expired hay chưa
        try {
            if (!token) throw new Error('No access token found!'); // Ép nhảy xuống catch

            // Mục đích: chỉ trả về user oauth2Response thôi
            const decodedAccessToken = verifyToken(token, TokenType.ACCESS) as TokenPayload;
            const { userId } = decodedAccessToken;
            const user = await userService.getUserData(userId);
            if (!user) {
                throw new Error(`Not found user with user id ${userId}`);
            }
            const oauth2Response = {
                token_type: "Bearer",
                access_token: token, // Pass payloadProps
                expires_in: jwtConfig.accessTokenExpirationTime,
                expires_at: 'accessTokenExpiresAt was saved in session storage!',
                refresh_token: 'token was saved in cookie!',
                user,
            }
            return RequestHandler.success(res, "WHOAMI", oauth2Response, `Successfully fetch data for user ${userId}.`);
        } catch (error) { // Dont have or Invalid or Expired
            const refresh_token = req.signedCookies['refresh_token'];
            if(!refresh_token) {
                return RequestHandler.error(res, "WHOAMIM", `No access and refresh token valid in cookie.`, 401);
            }
            // If have refresh token -> check if it is valid
            try {
                /*
                * If valid refresh token
                * 1. Tạo accessToken mới & refreshToken mới trong req cookie.
                * 2. Trả về user oauth2Reponse cho api get Me
                */
                const decodedRefreshToken = verifyToken(refresh_token, TokenType.REFRESH) as TokenPayload;
                const { userId } = decodedRefreshToken;
                
                const user = await userService.getUserData(userId);
                if (!user) {
                    throw new Error(`Not found user with user id ${userId}`);
                }
                const newAccessToken = generateAccessToken({ userId, userRole: (await user.role).name });
                const newRefreshToken = generateRefreshToken(userId);
                const accessTokenExpiresValue = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
                const refreshTokenExpiredValue = getEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME') as StringValue;
                res.cookie("access_token", newAccessToken, {
                    httpOnly: true,
                    signed: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "lax",
                    path: "/",
                    maxAge: ms(accessTokenExpiresValue), // 15 minutes
                });
                res.cookie("refresh_token", newRefreshToken, {
                    httpOnly: true,
                    signed: true,
                    secure: process.env.NODE_ENV === "production", // trả về true nếu .env set là production. Nếu dùng https thì hãy chỉnh sửa `NODE_ENV` trong .env thành thành production
                    sameSite: "lax",
                    path: "/api/auth/",
                    maxAge: ms(refreshTokenExpiredValue), // 7 days
                });

                const expiresInRaw = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
                const expiresInMs = ms(expiresInRaw);
                if (!expiresInMs) {
                    throw new Error('Invalid JWT_ACCESS_TOKEN_EXPIRATION_TIME');
                }
                const accessTokenExpiresAt = Date.now() + expiresInMs;
                const oauth2Response = {
                    token_type: "Bearer",
                    access_token: newAccessToken, // Pass payloadProps
                    expires_in: jwtConfig.accessTokenExpirationTime,
                    expires_at: accessTokenExpiresAt,
                    refresh_token: 'token was saved in cookie!',
                    user,
                }
                return RequestHandler.success(res, "WHOAMI", oauth2Response, `Successfully fetch data for user ${userId}. And we contemporaneously refresh your pair-token.`);
            } catch (error) {
                // If invalid refresh token -> no hope for api get Me
                return RequestHandler.error(res, "WHOAMI", `No access token, have refresh token but it"s invalid or expired.`, 401);
            }
        }
    }
}