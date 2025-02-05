import { useState } from "react";
import { Button } from "../ui/button"; // Ensure you have a button component for UI consistency
import ImageInput from "./ImageInput"; // Import ImageInput component
import { SubmitButton } from "./Buttons"; // Import SubmitButton component
import { type actionFunction } from "@/utils/types"; // Import actionFunction type

type SimpleImageUploadProps = {
    propertyId: string; 
    onImageUpload: (newImageUrls: string[]) => void; 
};

function SimpleImageUpload({ propertyId, onImageUpload }: SimpleImageUploadProps) {
    const [isFormVisible, setFormVisible] = useState(false);
    const [isLoading, setLoading] = useState(false); 

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append("id", propertyId);

        const imageInput = document.querySelector<HTMLInputElement>("input[name='image']");
        if (imageInput?.files?.length) {
            Array.from(imageInput.files).forEach((file) => {
                formData.append("image", file);
            });
        }

        setLoading(true); 

        const newImageUrls = Array.from(imageInput?.files || []).map((file) => URL.createObjectURL(file));

        onImageUpload(newImageUrls); 

        setLoading(false); 

        if (imageInput) {
            imageInput.value = ''; 
        }
    };

    return (
        <div>
            <Button variant="outline" size="sm" onClick={() => setFormVisible((prev) => !prev)}>
                Upload New Image
            </Button>

            {isFormVisible && (
                <div className="max-w-lg mt-4">
                    <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        <ImageInput name="image" multiple />
                        <SubmitButton size="sm" />
                    </form>
                </div>
            )}

            {isLoading && <p>Loading...</p>}
        </div>
    );
}

export default SimpleImageUpload;
