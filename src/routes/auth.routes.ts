import { Router } from "express";
import { AuthController } from "../controller/auth.controller";

const router = Router();

const authController = new AuthController();

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/refresh-token", (req, res) => authController.refresh(req, res));

export default router;