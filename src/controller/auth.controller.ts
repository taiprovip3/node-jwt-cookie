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

}