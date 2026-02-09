
import { Client } from "minio";
import { getEnv, getEnvNumber } from "../utils/env.util.js";

export const minioClient = new Client({
  endPoint: getEnv('MINIO_ENDPOINT', 'localhost'),
  port: getEnvNumber('MINIO_PORT', 9000),
  useSSL: getEnv('MINIO_USE_SSL', 'false') === 'true',
  accessKey: getEnv('MINIO_ACCESS_KEY', 'minioadmin'),
  secretKey: getEnv('MINIO_SECRET_KEY', 'minioadmin'),
});

export const BUCKET_NAME = getEnv('BUCKET_NAME', 'media');