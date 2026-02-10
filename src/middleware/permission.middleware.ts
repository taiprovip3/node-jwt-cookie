import { Response, NextFunction } from "express";
import { PermissionService } from "../service/permission.service.js";
import { CustomAuthExpressRequest } from "../types/CustomAuthExpressRequest.js";
import { RequestHandler } from "../types/ResponseHandler.js";

export const requirePermission = (permission: string) => {
  return async (req: CustomAuthExpressRequest, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      return RequestHandler.error(res, "MIDDLEWARE_MIDDLEWARE_VALIDATE", "No userId found -> Unauthenticated!", 401, "NO_USERID");
    }
    const permissionService = new PermissionService();
    const allowed = await permissionService.hasPermission(userId, permission);
    if (!allowed) {
      return RequestHandler.error(res, "MIDDLEWARE_MIDDLEWARE_VALIDATE", "You or your role dont have permission to do that!", 403, "NO_USERID");
    }
    next();
  };
};