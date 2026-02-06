import { Request, Response } from 'express';
import { minioClient, BUCKET_NAME } from "../config/minio.js";

import { v4 as uuidV4 } from 'uuid';
import { RequestHandler } from '../utils/response-handler.js';
import { AppDataSource } from '../config/data-source.js';
import { Video } from '../entity/Video.js';

export class VideoController {
    async uploadVideo(req: Request, res: Response) {
        try {
            // Lấy file từ request
            const file = req.file;
            const { title, uploaderId } = req.body;
            if(!file) {
                return res.status(400).json({ error: "No file uploaded." });
            }
            const videoId = uuidV4();

            const objectName = `videos/${videoId}-${file.originalname}`;

            // Upload to minio
            await minioClient.putObject(BUCKET_NAME, objectName, file.buffer, file.size, { contentType: file.mimetype });

            // Database
            const videoRepo = AppDataSource.getRepository(Video);
            const video = videoRepo.create({
                id: videoId,
                title: title || file.originalname,
                url: `${objectName}`,
                uploader: { id: Number(uploaderId) } as any,
            });
            await videoRepo.save(video);

            return RequestHandler.success(res, "UPLOAD_VIDEO", video, "Video uploaded successfully.", 201);
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "UPLOAD_VIDEO", (error as Error).message, 500);
        }
    }
}