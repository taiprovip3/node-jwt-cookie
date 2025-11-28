import { NextFunction, Request, Response } from "express";
import { v4 as uuid } from "uuid";

export const requestMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.locals.requestId = uuid();
    res.locals.startTime = Date.now();
    next();
}