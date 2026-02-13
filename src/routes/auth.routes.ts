import { Request, Response, Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import { requirePermission } from "../middleware/permission.middleware.js";
import { asyncHandler } from "../utils/async-handler.util.js";

const router = Router();

const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/refresh-token", (req, res) => authController.refresh(req, res));
router.get("/logout", verifyAccessToken , (req, res) => authController.logout(req, res)); // Gọi middleware verifyAccessToken để lấy ra access_token trong cookie
router.get("/me",  (req, res) => authController.me(req, res));
router.post("/change-password", verifyAccessToken, requirePermission("auth.change-password"), (req, res) => authController.changePassword(req, res));
router.post("/send-verification-email", verifyAccessToken, (req, res) => authController.sendVerificationEmail(req, res));
router.get("/verify-email", asyncHandler((req: Request, res: Response) => authController.verifyEmailBackLink(req, res)));

export default router;