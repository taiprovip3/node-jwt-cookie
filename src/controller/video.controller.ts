import { Request, Response } from 'express';
import { minioClient, BUCKET_NAME } from "../config/minio.js";

import { v4 as uuidV4 } from 'uuid';
import { RequestHandler } from '../utils/response-handler.js';
import { AppDataSource } from '../config/data-source.js';
import { Video } from '../entity/Video.js';
import { getEnv, getEnvNumber } from '../utils/env.js';

export class VideoController {
    async uploadVideo(req: Request, res: Response) {
        try {
            // Lấy file từ request
            const file = req.file;
            const { title, uploaderId } = req.body;

            if(!file) {
                return RequestHandler.error(res, "UPLOAD_VIDEO", "No file uploaded.", 400);
            }

            const videoId = uuidV4();
            const objectName = `videos/${videoId}-${file.originalname}`;

            // Upload to minio
            await minioClient.putObject(BUCKET_NAME, objectName, file.buffer, file.size, { contentType: file.mimetype });

            const publicUrl = `${getEnv('MINIO_PROTOCOL', 'http://')}${getEnv('MINIO_ENDPOINT', 'localhost')}:${getEnvNumber('MINIO_PORT', 9000)}/${BUCKET_NAME}/${objectName}`;
            console.log('publicUrl=', publicUrl);

            // Database
            const videoRepo = AppDataSource.getRepository(Video);
            const video = videoRepo.create({
                id: videoId,
                title: title || file.originalname,
                url: publicUrl,
                uploader: { id: Number(uploaderId) } as any,
            });
            await videoRepo.save(video);

            return RequestHandler.success(res, "UPLOAD_VIDEO", video, "Video uploaded successfully.", 201);
        } catch (error) {
            console.error(error);
            return RequestHandler.error(res, "UPLOAD_VIDEO", (error as Error).message, 500);
        }
    }

    async getVideosCursor (req: Request, res: Response) {
        // Get params from request
        const limit = Number(req.query.limit) || 10;
        const cursor = req.query.cursor as string | undefined;

        const videoRepo = AppDataSource.getRepository(Video);
        const qb = videoRepo
            .createQueryBuilder("video")
            .orderBy("video.uploadedAt", "DESC")
            .take(limit + 1);

        if (cursor) {
            qb.where("video.uploadedAt < :cursor", {
            cursor: new Date(cursor),
            });
        }

        const videos = await qb.getMany();

        let nextCursor: string | null = null;

        if (videos.length > limit) {
            const last = videos.pop()!;
            nextCursor = last.uploadedAt.toISOString();
        }

        return res.json({
            items: videos,
            nextCursor,
        });
    }
}