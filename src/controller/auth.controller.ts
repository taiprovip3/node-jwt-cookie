import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";
import { RequestHandler } from "../utils/response-handler.js";
import { CustomThrowError } from "../types/CustomThrowError.js";

const authService = new AuthService();

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
            const oauth2Response = await authService.login(username, password);

            res.cookie("refresh_token", oauth2Response.refresh_token, {
                httpOnly: true,
                signed: true,
                secure: process.env.NODE_ENV === "production", // trả về true nếu .env set là production. Nếu dùng https thì hãy chỉnh sửa `NODE_ENV` trong .env thành thành production
                sameSite: "lax",
                path: "/api/auth/refresh-token",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return RequestHandler.success(res, "LOGIN", oauth2Response, "User logged in successfully.");
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "LOGIN", (error as Error).message, 401);
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const refresToken = req.signedCookies.refresh_token;
            if (!refresToken) {
                // return res.status(401).json({ error: "Refresh token missing" });
                throw new CustomThrowError("REFRESH_TOKEN", "Refresh token is missing.", 401, "TOKEN_MISSING");
            }

            // create new access token
            const newAccess = await authService.refreshToken(refresToken);
            return RequestHandler.success(res, "REFRESH_TOKEN", { access_token: newAccess, token_type: "Bearer" }, "Access token refreshed successfully.");
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "REFRESH_TOKEN", (error as Error).message, 401);
        }
    }

    logout(req: Request, res: Response) {
        res.clearCookie("refresh_token", {
            path: "/api/auth/refresh-token",
        });
        return RequestHandler.success(res, "LOGOUT", null, "User logged out successfully.");
    }
}