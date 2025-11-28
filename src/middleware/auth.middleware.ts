import { NextFunction, Response } from "express";
import { verifyToken } from "../utils/jwt.js";
import { TokenType } from "../types/TokenType.js";
import { TokenPayload } from "../types/TokenPayload.js";
import { CustomAuthExpressRequest } from "../types/CustomAuthExpressRequest.js";
import { RequestHandler } from "../utils/response-handler.js";

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
        return RequestHandler.error(res, "MIDDLEWARE_VERIFY_ACCESS_TOKEN", "Access token is missing.", 401);
    }

    try {
        const decoded = verifyToken(token, TokenType.ACCESS) as TokenPayload;
        req.user = decoded;
        next();
    }  catch (error) {
        console.error(error);
        return RequestHandler.error(res, "MIDDLEWARE_VERIFY_ACCESS_TOKEN", "Invalid access token or expired.", 403);
    }
};