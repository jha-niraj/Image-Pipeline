import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isOriginal = req.originalUrl.includes('/upload');
        const subfolder = isOriginal ? "originals" : "masks";

        // Determine base upload path based on environment
        const baseUploadPath = process.env.NODE_ENV === 'production'
            ? '/opt/render/project/src/uploads'
            : path.join(__dirname, "../../uploads");

        // Combine with subfolder
        const uploadPath = path.join(baseUploadPath, subfolder);

        // Ensure directory exists
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueFilename);
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = process.env.ALLOWED_FILES_TYPES?.split(",") || ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
};

export const upload = multer({
    storage,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'),
    },
    fileFilter,
});