import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";

const authService = new AuthService();

export class AuthController {
    
    async register(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const user = await authService.register(username, password);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ message: (error as Error).message });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            const oauth2Response = await authService.login(username, password);

            res.cookie("refresh_token", oauth2Response.data.refresh_token, {
                httpOnly: true,
                signed: true,
                secure: process.env.NODE_ENV === "production", // trả về true nếu .env set là production. Nếu dùng https thì hãy chỉnh sửa `NODE_ENV` trong .env thành thành production
                sameSite: "lax",
                path: "/api/auth/refresh-token",
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });

            res.status(200).json(oauth2Response);
        } catch (error) {
            res.status(401).json({ message: (error as Error).message });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const refresToken = req.signedCookies.refresh_token;
            if (!refresToken) {
                return res.status(401).json({ error: "Refresh token missing" });
            }

            // create new access token
            const newAccess = await authService.refreshToken(refresToken);

            return res.json({
                access_token: newAccess,
                token_type: "Bearer",
            });

        } catch (err) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }
    }

    logout(req: Request, res: Response) {
        res.clearCookie("refresh_token", {
            path: "/api/auth/refresh-token",
        });

        res.json({ message: "Logged out" });
    }
}