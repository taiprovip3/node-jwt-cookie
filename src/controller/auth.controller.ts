import { Request, Response } from "express";
import { AuthService } from "../service/auth.service.js";
import { RequestHandler } from "../types/ResponseHandler.js";
import { CustomThrowError } from "../types/CustomThrowError.js";
import { UserService } from "../service/user.service.js";
import { CustomAuthExpressRequest } from "../types/CustomAuthExpressRequest.js";
import { buildOAuth2Response } from "../helpers/auth.helper.js";
import { setAuthCookies } from "../utils/cookie.util.js";

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

    logout(req: Request, res: Response) {
        res.clearCookie("access_token", {
            path: "/",
        });
        res.clearCookie("refresh_token", {
            path: "/api/auth/",
        });
        return RequestHandler.success(res, "LOGOUT", null, "User logged out successfully.");
    }

    async login(req: Request, res: Response) {
        try {
            const { username, password } = req.body;
            if(!username || !password) {
                throw new CustomThrowError("LOGIN", "Username or password is missing or invalid.", 400, "INVALID_INPUT");
            }

            const { responseData, accessToken, refreshToken } = await authService.login(username, password);
            setAuthCookies(res, accessToken, refreshToken);
            responseData['refresh_token'] = refreshToken;
            return RequestHandler.success(res, "LOGIN", responseData, "User logged in successfully.");
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
            const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
            setAuthCookies(res, accessToken, newRefreshToken);
            const responseData = buildOAuth2Response(accessToken);
            return RequestHandler.success(res, "REFRESH_TOKEN", responseData, "Access token refreshed successfully.");
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "REFRESH_TOKEN", (error as Error).message, 401);
        }
    }

    async me(req: Request, res: Response) {
        try {
            const token = req.signedCookies['access_token'] || req.headers['authorization']?.toString().replace('Bearer ', ''); // Cần làm rõ 3 TH token: Có hoặc không | Đúng định dạng | Expired hay chưa
            if (!token) throw new Error('No access token found!'); // Ép nhảy xuống catch
            // Mục đích: chỉ trả về user oauth2Response thôi
            const user = await userService.getUserFrom('ACCESS_TOKEN', token);
            const responseData = buildOAuth2Response(token, user);
            return RequestHandler.success(res, "WHOAMI", responseData, `Successfully fetch data for user ${user.id}.`);
        } catch { // Dont have or Invalid or Expired
            // Mục đích: Nếu có refreshToken thì trả về data user & cặp token mới
            const refreshToken = req.signedCookies['refresh_token'];
            if(!refreshToken) {
                return RequestHandler.error(res, "WHOAMIM", `No access and refresh token valid in cookie. Please return to login again.`, 401);
            }
            // Check refreshToken
            try {
                /*
                * If valid refresh token
                * 1. Tạo accessToken mới & refreshToken mới trong req cookie.
                * 2. Trả về user oauth2Reponse cho api get Me
                */
                const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
                setAuthCookies(res, accessToken, newRefreshToken);
                const user = await userService.getUserFrom('REFRESH_TOKEN', refreshToken);
                const responseData = buildOAuth2Response(accessToken, user);
                return RequestHandler.success(res, "WHOAMI", responseData, `Successfully fetch data for user ${user.id}. And we contemporaneously refresh your pair-token.`);
            } catch (error) {
                // If invalid refresh token -> no hope for api get Me
                console.error(error);
                return RequestHandler.error(res, "WHOAMI", `No access token, have refresh token but it"s invalid or expired.`, 401);
            }
        }
    }

    async changePassword(req: CustomAuthExpressRequest, res: Response) {
        const userId = req.user?.userId; // hoặc req.userId
        if(!userId) {
            return RequestHandler.error(res, "CHANGE_PASSWORD", `Missing userId decoded from token!.`, 400);
        }
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return RequestHandler.error(res, "CHANGE_PASSWORD", `Missing oldPassword or newPassword.`, 400);
        }
        await authService.changePassword({
            userId,
            oldPassword,
            newPassword,
        });
        return RequestHandler.success(res, "WHOAMI", { message: 'This app still keep login session.' }, 'Password changed successfully.');
    }

    async sendVerificationEmail(req: CustomAuthExpressRequest, res: Response) {
        const userId = req.user?.userId;
        if(!userId) {
            return RequestHandler.error(res, "SEND_VERIFICATION_EMAIL", "Not found userId from decoded request token!", 400);
        }
        await authService.sendEmailVerification(userId);
    }

    async verifyEmailBackLink(req: Request, res: Response) {
        const { token } = req.query as { token?: string };
        if (!token) {
            return RequestHandler.error(res, "VERIFY_EMAIL", "Token missing!", 400);
        }
        return RequestHandler.success(res, "VERIFY_EMAIL", await authService.verifyEmailBackLink(token), "OK! You may close this window now!", 200);
    }
}