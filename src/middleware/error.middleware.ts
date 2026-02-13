import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "../types/ResponseHandler.js";
import { CustomThrowError } from "../types/CustomThrowError.js";

export const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof CustomThrowError) {
        return RequestHandler.error(res, err.action, err.message, err.statusCode, err.errorCode);
    }
    if (err instanceof Error) {
        return RequestHandler.error(res, "UNKNOWN", err.message, 500);
    }
    return RequestHandler.error(res, "UNKNOWN", "Internal Server Error", 500); // Trường hợp quỷ dị: throw string, number, object…
}