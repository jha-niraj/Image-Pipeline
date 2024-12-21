import prisma from '../config/database';
import { PaginationQuery } from '../types';

const ImageService = {
    async createImagePair(originalImagePath: string) {
        return prisma.image.create({
            data: {
                originalImagePath,
            },
        });
    },

    async updateMaskImage(id: string, maskImagePath: string) {
        return prisma.image.update({
            where: { id },
            data: { maskImagePath },
        });
    },

    async getImagePair(id: string) {
        return prisma.image.findUnique({
            where: { id },
        });
    },

    async getAllImagePairs({ page = 1, limit = 10 }: PaginationQuery) {
        const skip = (page - 1) * limit;
        const [total, items] = await Promise.all([
            prisma.image.count(),
            prisma.image.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        return {
            items,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    },
};

export default ImageService;
