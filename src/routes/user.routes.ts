import { Request, Response, Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import { asyncHandler } from "../utils/async-handler.util.js";
import { validateBody } from "../middleware/validate-body.middleware.js";
import { UpdateProfileDto } from "../dto/update-profile.dto.js";

const router = Router();

const userController = new UserController();

router.get("/profile/:id", verifyAccessToken, allowRoles("USER"), userController.getProfile);
router.post("/profile/:id", verifyAccessToken, allowRoles("USER"), validateBody(UpdateProfileDto), asyncHandler((req: Request, res: Response) => userController.updateProfile(req, res)) );

export default router;