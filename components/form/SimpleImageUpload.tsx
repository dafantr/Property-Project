"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";
import { uploadPropertyImagesAction } from "@/utils/actions";

type SimpleImageUploadProps = {
    propertyId: string;
    onImageUpload: (newImageUrls: string[]) => void;
};

function SimpleImageUpload({ propertyId, onImageUpload }: SimpleImageUploadProps) {
    const [isFormVisible, setFormVisible] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("propertyId", propertyId);

        const imageInput = document.querySelector<HTMLInputElement>("input[name='image']");
        if (!imageInput?.files?.length) {
            setLoading(false);
            return;
        }

        // Append all selected images
        for (const file of imageInput.files) {
            formData.append("images", file);
        }

        // Call the server action to upload images
        const result = await uploadPropertyImagesAction(formData);

        if (result.success) {
            onImageUpload(result.imageUrls);
        } else {
            console.error(result.error);
        }

        setLoading(false);
        setFormVisible(false);
    };

    return (
        <div>
            <Button variant="outline" size="sm" onClick={() => setFormVisible((prev) => !prev)}>
                Upload New Image
            </Button>

            {isFormVisible && (
                <div className="max-w-lg mt-4">
                    <form onSubmit={handleSubmit}>
                        <ImageInput name="image" multiple />
                        <SubmitButton size="sm" />
                    </form>
                </div>
            )}

            {isLoading && <p>Uploading...</p>}
        </div>
    );
}

export default SimpleImageUpload;
