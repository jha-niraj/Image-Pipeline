import { useState, useRef, ChangeEvent } from 'react';
// @ts-ignore
import CanvasDraw from 'react-canvas-draw';
import { generateMaskFromCanvas } from '../utils/maskUtils';
import toast, { Toaster } from "react-hot-toast";
import { X } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";

const ImagePaintingApp = () => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [uploadedImageFileFormat, setUploadedImageFileFormat] = useState<File | null>(null);
    const [brushRadius, setBrushRadius] = useState<number>(12);
    const [maskImage, setMaskImage] = useState<string | null>(null);
    const [showImages, setShowImages] = useState<boolean>(false);
    const canvasRef = useRef<CanvasDraw>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [uploadingOriginal, setUploadingOriginal] = useState<boolean>(false);
    const [uploadingMasked, setUploadingMasked] = useState<boolean>(false);
    // @ts-ignore
    const [originalId, setOriginalId] = useState<string | null>(() => {
        return localStorage.getItem("originalid");
    });

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setUploadedImageFileFormat(file!);
        if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const result = e.target?.result;
                if (typeof result === 'string') {
                    setUploadedImage(result);
                    setShowImages(false);
                    setMaskImage(null);
                }
            };
            reader.readAsDataURL(file);
        } else {
            toast.error("Please upload a valid JPEG or PNG image");
        }
    };
    const handleClear = (): void => {
        setUploadedImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        localStorage.removeItem("originalid");
        setOriginalId(null);
    };
    const handleClearCanvas = (): void => {
        if (canvasRef.current) {
            canvasRef.current.clear();
            setMaskImage(null);
            setShowImages(false);
        }
    }
    const generateMask = async (): Promise<void> => {
        if (canvasRef.current) {
            try {
                const maskData = canvasRef.current.getSaveData();
                const maskImageUrl = await generateMaskFromCanvas(maskData);
                setMaskImage(maskImageUrl);
                setShowImages(true);
            } catch (error) {
                console.error('Error generating mask:', error);
                toast.error('Failed to generate mask');
            }
        }
    };
    // const uploadImage = (dataUrl: string, filename: string): void => {
    //     const link = document.createElement('a');
    //     link.href = dataUrl;
    //     link.download = filename;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    // };
    // Function to convert the maskImage string file to the actual file:
    const convertBase64ToFile = (dataUrl: string, fileName: string): File => {
        const base64Data = dataUrl.split(',')[1];
        const binaryData = atob(base64Data);

        const arrayBuffer = new ArrayBuffer(binaryData.length);
        const uint8Array = new Uint8Array(arrayBuffer);

        for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
        }

        const blob = new Blob([uint8Array], { type: 'image/png' });
        return new File([blob], fileName, { type: 'image/png' });
    };

    const uploadOriginalImage = async () => {
        setUploadingOriginal(true);

        try {
            const formData = new FormData();
            if (!uploadedImageFileFormat) {
                toast.error("No image selected");
                return;
            }
            formData.append('image', uploadedImageFileFormat);

            const response = await axios.post("http://localhost:3000/api/images/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (!response) {
                toast.error("Failed to upload the original image");
                return;
            }
            const data = await response.data;
            const newId = data?.imagePair?.id;
            localStorage.setItem("originalid", newId);
            setOriginalId(newId);
            toast.success(data.msg);
            setUploadingOriginal(false);
        } catch (err: any) {
            console.error('Error uploading original image:', err);
            toast.error('Failed to  mask');
        } finally {
            setUploadingMasked(false);
        }
    }
    const uploadMaskedImage = async () => {
        console.log(originalId);
        if (!originalId || originalId === "") {
            toast.error("Please upload the original image first and then the masked image");
            return;
        }
        setUploadingMasked(true);

        try {
            setUploadingMasked(true);
            const maskFormData = new FormData();
            if (!maskImage) {
                toast.error("Please generate the mask image");
                return;
            }
            const maskedImageFile = convertBase64ToFile(maskImage, "mask.png");
            console.log("Masked file: ", maskedImageFile);
            maskFormData.append('image', maskedImageFile);

            const response = await axios.post(`http://localhost:3000/api/images/${originalId}/mask`, maskFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (!response) {
                toast.error("Failed to upload the maksed image");
                return;
            }
            const data = await response.data;
            toast.success(data.msg);
        } catch (err: any) {
            console.log('Error uploading original image:', err)
            toast.error("Failed to upload masked image");
        } finally {
            setUploadingMasked(false);
        }
    }

    return (
        <div className="flex flex-col w-full items-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <Toaster />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-6xl"
            >
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-center mb-3">Image Inpainting Tool</h1>
                    <div className="flex w-full items-center justify-between gap-4">
                        <div className='flex border-2 w-full md:w-2/3 border-gray-400 p-1 rounded-2xl items-center justify-between mx-auto'>
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageUpload}
                                ref={fileInputRef}
                                className="text-sm w-full text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <button
                                onClick={handleClear}
                                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                            >
                                <X className="h-5 w-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="flex gap-2">
                            <Link 
                                to="/imagepair"
                                className={`px-4 py-2 bg-blue-500 rounded-2xl text-white transition-colors duration-200`}
                            >
                                Fetch Image Pair
                            </Link>
                            <Link 
                                to="/allimagespair"
                                className={`px-4 py-2 bg-green-500 rounded-2xl text-white transition-colors duration-200`}
                            >
                                Fetch All Image Pair
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
            <div className="flex flex-col lg:flex-row gap-4 items-center jsutify-center">
                {
                    uploadedImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="w-full max-w-4xl mt-8"
                        >
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brush Size: {brushRadius}px</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="50"
                                        value={brushRadius}
                                        onChange={(e) => setBrushRadius(Number(e.target.value))}
                                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                                <div className="border rounded-lg p-2 mb-4 bg-gray-50">
                                    <CanvasDraw
                                        ref={canvasRef}
                                        brushRadius={brushRadius}
                                        brushColor="#FFFFFF"
                                        backgroundColor="#000000"
                                        imgSrc={uploadedImage}
                                        canvasWidth={600}
                                        canvasHeight={400}
                                        className="rounded border mx-auto"
                                    />
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={handleClearCanvas}
                                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors duration-200"
                                    >
                                        Clear Canvas
                                    </button>
                                    <button
                                        onClick={generateMask}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                                    >
                                        Generate Mask
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
                {
                    showImages && uploadedImage && maskImage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="w-full max-w-4xl"
                        >
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-2xl font-bold text-center mb-6">Original and Mask Images</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col items-center justify-between gap-4">
                                        <h3 className="text-lg font-semibold mb-3">Original Image</h3>
                                        <div className="w-full border flex flex-col items-center justify-center rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={uploadedImage}
                                                alt="Original"
                                                className="w-full h-auto object-contain"
                                            />
                                        </div>
                                        <button
                                            onClick={uploadOriginalImage}
                                            disabled={uploadingOriginal}
                                            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 ${uploadingOriginal ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingOriginal ? "Uploading..." : "Upload Original Image"}
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center justify-between gap-4">
                                        <h3 className="text-lg font-semibold mb-3">Mask Image</h3>
                                        <div className="w-full border rounded-lg overflow-hidden bg-gray-50">
                                            <img
                                                src={maskImage}
                                                alt="Mask"
                                                className="w-full h-auto object-contain"
                                            />
                                        </div>
                                        <button
                                            onClick={uploadMaskedImage}
                                            disabled={uploadingMasked}
                                            className={`px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200 ${uploadingMasked ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploadingMasked ? "Uploading..." : "Upload Masked Image"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                }
            </div>
        </div>
    );
};

export default ImagePaintingApp;