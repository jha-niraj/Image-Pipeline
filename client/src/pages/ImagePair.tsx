import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL, deployedUrl } from "../config";

interface ImagePairDataProps {
    id: string;
    originalImagePath: string;
    maskImagePath: string;
    createAt: Date;
    updatedAt: Date;
}
const ImagePair = () => {
    // @ts-ignore
    const [id, setId] = useState<string>("e9c12762-5e20-4478-a90c-39c1fd27830e");
    const [imagePairData, setImagePairData] = useState<ImagePairDataProps | null>(null);

    useEffect(() => {
        const fetchImagePairData = async () => {
            try {
                const response = await axios.get(`${deployedUrl}/api/images/${id}`);
                if (!response) {
                    toast.error("Failed to fetch the image pair data");
                    return;
                }
                const data = await response.data;
                setImagePairData(data?.imagePair);
            } catch (err: any) {
                console.log("Unable to fetch the image pair data: ", err);
                toast.error("Failed to fetch the image pair");
            }
        }
        fetchImagePairData();
    }, [id]);

    const originalImagePath = `${deployedUrl}${imagePairData?.originalImagePath}`;
    const maskImagePath = `${deployedUrl}${imagePairData?.maskImagePath}`;

    console.log(imagePairData);
    console.log(originalImagePath);
    console.log(maskImagePath);

    return (
        <div>
            <Toaster />
            <div>
                <img
                    src={`${BASE_URL}${imagePairData?.originalImagePath}`}
                    alt="Original"
                />
                <img
                    src={`${BASE_URL}${imagePairData?.maskImagePath}`}
                    alt="Mask"
                />
            </div>
        </div>
    )
}

export default ImagePair;