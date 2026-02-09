import { NextFunction, Response } from "express";
import { CustomAuthExpressRequest } from "../types/CustomAuthExpressRequest.js";
import { RequestHandler } from "../types/ResponseHandler.js";

export const allowRoles = (...roles: string[]) => { // ... mean allowRoles("admin", "manager") instead of allowRoles(["admin", "manager"])
    return (req: CustomAuthExpressRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.userRole;
        
        if (!req.user || typeof userRole !== 'string' || !roles.includes(userRole)) {
            return RequestHandler.error(res, "MIDDLEWARE_ALLOW_ROLES", `Forbidden: Insufficient role ${roles.toString()}`, 403, "NO_PERMISSION");
        }
        next();
    };
};