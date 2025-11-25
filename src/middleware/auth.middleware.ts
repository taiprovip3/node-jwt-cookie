import { NextFunction, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { TokenType } from "../types/TokenType.js";
import { TokenPayload } from "../types/TokenPayload.js";
import { CustomAuthExpressRequest } from "../types/CustomAuthExpressRequest.js";

/**
 * 
 * @param req CustomAuthenticatedRequest extended request object
 * @param res 
 * @param next 
 * @returns Kiểm tra và xác thực access token từ header hoặc cookie
 */
export const verifyAccessToken = (req: CustomAuthExpressRequest, res: Response, next: NextFunction) => {
    const token = req.cookies['access_token'] || req.headers['authorization']?.toString().replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Access token missing' });
    }

    try {
        const decoded = verifyToken(token, TokenType.ACCESS) as TokenPayload;
        req.user = decoded;
        next();
    }  catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Invalid access token or expired.' });
    }
};