import { Request, Response, NextFunction } from "express";
import multer from "multer";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error(error);

    if(error instanceof multer.MulterError) {
        return res.status(400).json({
            error: "File upload Error",
            message: error.message
        });
    }

    if(error.message === "Invalid file types") {
        return res.status(400).json({
            error: "Invald file type",
            message: "Only JPEG and PNG files are allowed",
        })
    }

    return res.status(500).json({
        error: "Internal server error",
        message: error.message
    })
}