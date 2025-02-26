"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    fetchRentalDetails,
    updatePropertyAction
} from "@/utils/actions";
import FormContainer from "@/components/form/FormContainer";
import FormInput from "@/components/form/FormInput";
import CategoriesInput from "@/components/form/CategoriesInput";
import PriceInput from "@/components/form/PriceInput";
import TextAreaInput from "@/components/form/TextAreaInput";
import CounterInput from "@/components/form/CounterInput";
import AmenitiesInput from "@/components/form/AmenitiesInput";
import { SubmitButton } from "@/components/form/Buttons";
import SimpleImageUpload from "@/components/form/SimpleImageUpload";
import CitiesInput from "@/components/form/CitiesInput";
import { FaTrash } from "react-icons/fa";

interface Property {
    id: string;
    name: string;
    tagline: string;
    price: number;
    category: string;
    city: string;
    googleMapsUrl: string;
    description: string;
    guests: number;
    bedrooms: number;
    beds: number;
    baths: number;
    amenities: string;
    image: string[];
}

async function EditRentalPage({ params }: { params: { id: string } }) {
    const [property, setProperty] = useState<Property | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]); // State for uploaded images
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        console.log("Updated property images:", property?.image);
        const fetchData = async () => {
            try {
                const propertyData = await fetchRentalDetails(params.id);
                if (!propertyData) {
                    router.push("/");
                } else {
                    setProperty(propertyData);
                }
            } catch (error) {
                console.error("Error fetching property data:", error);
            }
        };
        fetchData();
    }, [params.id, router]);

    if (!property) return <p>Loading...</p>;

    const defaultAmenities = JSON.parse(property.amenities);

    const handleImageUpload = (newImageUrls: string[]) => {
        console.log("New uploaded images:", newImageUrls);

        // Only update the uploaded images if new images are being uploaded
        if (newImageUrls.length > 0) {
            setUploadedImages((prevImages) => [...prevImages, ...newImageUrls]);
            setProperty((prev) => ({
                ...prev!,
                image: [...(prev?.image || []), ...newImageUrls],
            }));
        }
    };

    const handleDeleteImage = (imageUrl: string) => {
        setDeletedImages((prev) => [...prev, imageUrl]); // Add to deleted images list

        // Remove from UI instantly
        setProperty((prev) => ({
            ...prev!,
            image: prev?.image?.filter((img: string) => img !== imageUrl) || [],
        }));
    };

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">
                Edit Property
            </h1>
            <div className="border p-8 rounded-md">
                <div className="mb-8">
                    <h2 className="text-xl font-medium mb-4">
                        Uploaded Images
                    </h2>
                    <div className="grid grid-cols-8 gap-2">
                        {Array.isArray(property.image) &&
                            property.image.length > 0 ? (
                            property.image.map((image: string) => (
                                <div key={image} className="relative group">
                                    <img
                                        src={image}
                                        alt="Property Image"
                                        className="w-32 h-32 object-cover rounded-md"
                                    />

                                    {/* Delete Button */}
                                    <button
                                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white rounded-md opacity-0 group-hover:opacity-100 transition"
                                        onClick={() => handleDeleteImage(image)}
                                    >
                                        <FaTrash className="w-6 h-6" />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No images uploaded yet.</p>
                        )}
                    </div>
                </div>

                <SimpleImageUpload
                    propertyId={property.id}
                    onImageUpload={handleImageUpload}
                />

                {/* 🚀 Move delete tracking inside FormContainer */}
                <FormContainer action={updatePropertyAction}>
                    <input type="hidden" name="id" value={property.id} />
                    <input type="hidden" name="deletedImages" value={deletedImages.join(",")} />
                    <input type="hidden" name="image" value={[...property.image, ...uploadedImages].join(",")} />


                    <div className="grid md:grid-cols-2 gap-8 mb-4 mt-8">
                        <FormInput
                            name="name"
                            type="text"
                            label="Name (20 limit)"
                            defaultValue={property.name}
                        />
                        <FormInput
                            name="tagline"
                            type="text"
                            label="Tagline (30 limit)"
                            defaultValue={property.tagline}
                        />
                        <PriceInput defaultValue={property.price} />
                        <CategoriesInput defaultValue={property.category} />
                        <CitiesInput defaultValue={property.city} />
                        <FormInput
                            name="googleMapsUrl"
                            type="text"
                            label="Google Maps URL"
                            defaultValue={property.googleMapsUrl}
                        />
                    </div>

                    <TextAreaInput
                        name="description"
                        labelText="Description (10 - 100 Words)"
                        defaultValue={property.description}
                    />

                    <h3 className="text-lg mt-8 mb-4 font-medium">
                        Accommodation Details
                    </h3>
                    <CounterInput detail="guests" defaultValue={property.guests} />
                    <CounterInput detail="bedrooms" defaultValue={property.bedrooms} />
                    <CounterInput detail="beds" defaultValue={property.beds} />
                    <CounterInput detail="baths" defaultValue={property.baths} />

                    <h3 className="text-lg mt-10 mb-6 font-medium">Amenities</h3>
                    <AmenitiesInput defaultValue={defaultAmenities} />

                    <SubmitButton text="Edit Property" className="mt-12" />
                </FormContainer>
            </div>
        </section>
    );
}

export default EditRentalPage;
