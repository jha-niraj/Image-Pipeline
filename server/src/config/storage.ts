import path from "path";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Request path:', req.path);
        console.log('Request originalUrl:', req.originalUrl);

        // Change the condition to check the full URL path
        const isOriginal = req.originalUrl.includes('/upload');
        console.log('Is Original:', isOriginal);

        const uploadPath = path.join(__dirname, "../../uploads", isOriginal ? "originals" : "masks");
        console.log('Upload path:', uploadPath);

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
})