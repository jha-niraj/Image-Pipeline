export interface Image {
    id: string;
    originalImagePath: string;
    maskedImagePath?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}