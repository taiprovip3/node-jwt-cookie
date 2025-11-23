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
            res.status(200).json(oauth2Response);
        } catch (error) {
            res.status(401).json({ message: (error as Error).message });
        }
    }
}