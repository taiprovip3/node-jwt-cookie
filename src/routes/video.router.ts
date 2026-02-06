import { Router } from "express";
import { VideoController } from "../controller/video.controller.js";
import { upload } from "../config/upload.js";

const router = Router();

const videoController = new VideoController();

router.post("/upload", upload.single("file"), (req, res) => videoController.uploadVideo(req, res));
router.get("/", (req, res) => videoController.getVideosCursor(req, res));

export default router;