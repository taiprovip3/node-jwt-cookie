import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = Router();

const userController = new UserController();

router.get("/profile/:id", verifyAccessToken, allowRoles("USER") , userController.getProfile);

export default router;