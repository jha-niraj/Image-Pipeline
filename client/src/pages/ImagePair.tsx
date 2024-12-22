import axios from "axios";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { BASE_URL } from "../config";

interface ImagePairDataProps {
    id: string;
    originalImagePath: string;
    maskImagePath: string;
    createAt: Date;
    updatedAt: Date;
}
const ImagePair = () => {
    const [id, setId] = useState<string>("512d8251-cf49-4c03-832f-9365e00bdd39");
    const [imagePairData, setImagePairData] = useState<ImagePairDataProps | null>(null);

    useEffect(() => {
        const fetchImagePairData = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/images/${id}`);
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

    const originalImagePath = `${BASE_URL}${imagePairData?.originalImagePath}`;
    const maskImagePath = `${BASE_URL}${imagePairData?.maskImagePath}`;

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