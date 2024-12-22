import { Request, Response, NextFunction } from 'express';
import ImageService from '../services/imageServices';
import path from 'path';

export const uploadOriginal = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const imagePath = path.relative(path.join(__dirname, '../../'), req.file.path);
        const imagePair = await ImageService.createImagePair(imagePath);

        res.status(201).json({ msg: "Image uploaded successfully", imagePair });
    } catch (error) {
        next(error);
    }
};

export const uploadMask = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const { id } = req.params;
        const imagePath = path.relative(path.join(__dirname, '../../'), req.file.path);
        const imagePair = await ImageService.updateMaskImage(id, imagePath);

        res.json({ msg: "Masked image uploaded successfully", imagePair});
    } catch (error) {
        next(error);
    }
};

export const getImagePair = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params;
        const imagePair = await ImageService.getImagePair(id);

        if (!imagePair) {
            res.status(404).json({ error: 'Image pair not found' });
            return;
        }

        res.json({ msg: "Fetched the image with the particular id.", imagePair });
    } catch (error) {
        next(error);
    }
};

export const getAllImagePairs = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const result = await ImageService.getAllImagePairs({ page, limit });
        res.json({ msg: "Fetched all the images with pairs", result });
    } catch (error) {
        next(error);
    }
};