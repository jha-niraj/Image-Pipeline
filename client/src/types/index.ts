// types/types.ts

export interface CanvasLine {
    points: Array<{
        x: number;
        y: number;
    }>;
    brushColor: string;
    brushRadius: number;
}

export interface CanvasSaveData {
    width: number;
    height: number;
    lines: CanvasLine[];
    brushRadius: number;
}

export interface MaskGenerationResult {
    maskImageUrl: string;
    originalImageUrl: string;
}