import React, { useState, useRef, ChangeEvent } from 'react';
// @ts-ignore
import CanvasDraw from 'react-canvas-draw';
import { generateMaskFromCanvas } from '../utils/maskUtils';

const ImageInpaintingApp: React.FC = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [brushRadius, setBrushRadius] = useState<number>(12);
    const [maskImage, setMaskImage] = useState<string | null>(null);
    const [showImages, setShowImages] = useState<boolean>(false);
    const canvasRef = useRef<CanvasDraw>(null);

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    setUploadedImage(result);
                    setShowImages(false); // Reset display when new image is uploaded
                    setMaskImage(null);
                }
            };
            reader.readAsDataURL(file);
        } else {
            alert("Please upload a valid JPEG or PNG image");
        }
    };

    const handleClear = (): void => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            setMaskImage(null);
            setShowImages(false);
        }
    };

    const generateMask = async (): Promise<void> => {
        if (canvasRef.current) {
            try {
                const maskData = canvasRef.current.getSaveData();
                const maskImageUrl = await generateMaskFromCanvas(maskData);
                setMaskImage(maskImageUrl);
                setShowImages(true);
            } catch (error) {
                console.error('Error generating mask:', error);
                alert('Failed to generate mask');
            }
        }
    };

    const downloadImage = (dataUrl: string, filename: string): void => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-100 p-8">
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold text-center mb-8">Image Inpainting Tool</h1>

                {/* Image Upload Section */}
                <div className="mb-6">
                    <input
                        type="file"
                        accept="image/jpeg,image/png"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                </div>

                {/* Canvas Section */}
                {uploadedImage && (
                    <div className="mb-6">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Brush Size: {brushRadius}px</label>
                            <input
                                type="range"
                                min="1"
                                max="50"
                                value={brushRadius}
                                onChange={(e) => setBrushRadius(Number(e.target.value))}
                                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="border rounded-lg p-2 mb-4">
                            <CanvasDraw
                                ref={canvasRef}
                                brushRadius={brushRadius}
                                brushColor="#FFFFFF"
                                backgroundColor="#000000"
                                imgSrc={uploadedImage}
                                canvasWidth={800}
                                canvasHeight={600}
                                className="rounded border"
                            />
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mb-6">
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Clear Canvas
                            </button>
                            <button
                                onClick={generateMask}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Generate Mask
                            </button>
                            {maskImage && (
                                <button
                                    onClick={() => downloadImage(maskImage, 'mask.png')}
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Download Mask
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Side by Side Image Display Section */}
                {showImages && uploadedImage && maskImage && (
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-center mb-6">Original and Mask Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-3">Original Image</h3>
                                <div className="w-full border rounded-lg overflow-hidden">
                                    <img
                                        src={uploadedImage}
                                        alt="Original"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col items-center">
                                <h3 className="text-lg font-semibold mb-3">Mask Image</h3>
                                <div className="w-full border rounded-lg overflow-hidden">
                                    <img
                                        src={maskImage}
                                        alt="Mask"
                                        className="w-full h-auto object-contain"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageInpaintingApp;