import { Response } from "express";
import { CustomApiResponse } from "../types/CustomApiResponse.js";

export class RequestHandler {
    static success<T>(res: Response, action: string, data: T, message = "Success", statusCode = 200) {
        const response: CustomApiResponse<T> = {
            requestId: res.locals.requestId,
            timestamp: new Date().toISOString(),
            action,
            success: true,
            message,
            data,
            path: res.req.originalUrl,
            method: res.req.method,
            executionTime: Date.now() - res.locals.startTime,
        };
        return res.status(statusCode).json(response);
        
    }

    static error(res: Response, action: string, message: string, statusCode: number, errorCode?: string) {
        const response: CustomApiResponse<unknown> = {
            requestId: res.locals.requestId,
            timestamp: new Date().toISOString(),
            action,
            success: false,
            message,
            errorCode,
            path: res.req.originalUrl,
            method: res.req.method,
            executionTime: Date.now() - res.locals.startTime,
        };
        return res.status(statusCode).json(response);
    }
}