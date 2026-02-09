import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "../types/ResponseHandler.js";

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error middleware catch an error from somewhere throw:", err);
    return RequestHandler.error(res, err.action || "UNKNOW", err.message || "Internal Server Error", err.statusCode || 500, err.errorCode);
}