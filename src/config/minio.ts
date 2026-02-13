
import { Client } from "minio";
import { getEnv } from "../utils/env.util.js";

export const minioClient = new Client({
  endPoint: getEnv('MINIO_ENDPOINT', { default: 'localhost' }),
  port: getEnv('MINIO_PORT', { default: 9000 }),
  useSSL: getEnv('MINIO_USE_SSL', { default: false }),
  accessKey: getEnv('MINIO_ACCESS_KEY', { default: 'minioadmin' }),
  secretKey: getEnv('MINIO_SECRET_KEY', { default: 'minioadmin' }),
});

export const BUCKET_NAME = getEnv('BUCKET_NAME', { default: 'media' });