import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "../utils/response-handler.js";

/**
 * Catch all error and return customized response
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log("Error middleware catch an unexpected error by throw:", err);
    return RequestHandler.error(res, err.action || "UNKNOW", err.message || "Internal Server Error", err.statusCode || 500, err.errorCode);
}