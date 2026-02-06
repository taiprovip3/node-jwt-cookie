import multer from 'multer';

export const upload  = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 500 * 1024 * 1024, // Giới hạn kích thước file tải lên là 500MB
    }
});