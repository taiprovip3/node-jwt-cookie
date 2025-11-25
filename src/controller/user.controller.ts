import { Request, Response } from "express";
import { UserService } from "../service/user.service.js";

const userService = new UserService();
export class UserController {
    async getProfile (req: Request, res: Response) {
        const userId = Number(req.params.id);
        try {
            const userProfile = await userService.getProfile(userId);
            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(userProfile);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}