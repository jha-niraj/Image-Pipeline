// utils/maskUtils.ts

import { CanvasSaveData } from '../types/index';

export const generateMaskFromCanvas = (canvasData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            // Parse the saved data from react-canvas-draw
            const savedData: CanvasSaveData = JSON.parse(canvasData);

            // Set canvas dimensions
            canvas.width = savedData.width;
            canvas.height = savedData.height;

            // Fill canvas with black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw white lines for the mask
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = savedData.brushRadius * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            // Draw all lines from the saved data
            savedData.lines.forEach(line => {
                if (line.points.length > 0) {
                    ctx.beginPath();
                    ctx.moveTo(line.points[0].x, line.points[0].y);

                    line.points.forEach(point => {
                        ctx.lineTo(point.x, point.y);
                    });

                    ctx.stroke();
                }
            });

            // Convert canvas to base64
            const maskImage: string = canvas.toDataURL('image/png');
            resolve(maskImage);
        } catch (error) {
            reject(error);
        }
    });
};