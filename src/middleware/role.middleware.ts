import { NextFunction, Response } from "express";
import { CustomAuthExpressRequest } from "../types/CustomAuthExpressRequest.js";

export const allowRoles = (...roles: string[]) => { // ... mean allowRoles("admin", "manager") instead of allowRoles(["admin", "manager"])
    return (req: CustomAuthExpressRequest, res: Response, next: NextFunction) => {
        const userRole = req.user?.userRole;
        
        if (!req.user || typeof userRole !== 'string' || !roles.includes(userRole)) {
            return res.status(403).json({ message: `Forbidden: Insufficient role ${roles.toString()}` });
        }
        next();
    };
};