import { Request, Response } from "express";
import { UserService } from "../service/user.service.js";
import { RequestHandler } from "../types/ResponseHandler.js";

const userService = new UserService();
export class UserController {
    async getProfile (req: Request, res: Response) {
        const userId = Number(req.params.id);
        try {
            const userProfile = await userService.getProfile(userId);
            if (!userProfile) {
                return RequestHandler.error(res, "GET_PROFILE", "User not found.", 404);
            }
            return RequestHandler.success(res, "GET_PROFILE", userProfile, "User profile retrieved successfully.");
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "GET_PROFILE", "Internal server error.", 500);
        }
    }
}