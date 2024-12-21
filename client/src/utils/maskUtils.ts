import { CanvasSaveData } from '../types/index';

export const generateMaskFromCanvas = (canvasData: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        try {
            const canvas: HTMLCanvasElement = document.createElement('canvas');
            const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
            if (!ctx) {
                throw new Error('Could not get canvas context');
            }

            const savedData: CanvasSaveData = JSON.parse(canvasData);
            canvas.width = savedData.width;
            canvas.height = savedData.height;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = savedData.brushRadius * 2;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

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

            const maskImage: string = canvas.toDataURL('image/png');
            resolve(maskImage);
        } catch (error) {
            reject(error);
        }
    });
};