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

// ✅ Define the correct Property type with explicit `createdAt` and `updatedAt` as strings
interface Property {
    id: string;
    name: string;
    tagline: string;
    category: string;
    image: string[];
    city: string;
    description: string;
    price: number;
    guests: number;
    bedrooms: number;
    beds: number;
    baths: number;
    amenities: string;
    googleMapsUrl: string;
    createdAt: string; // Ensure it's stored as a string
    updatedAt: string;
    profileId: string;
}

async function EditRentalPage({ params }: { params: { id: string } }) {
    const [property, setProperty] = useState<Property | null>(null);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const [deletedImages, setDeletedImages] = useState<string[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const propertyData = await fetchRentalDetails(params.id);

                if (!propertyData) {
                    router.push("/");
                } else {
                    // ✅ Convert createdAt & updatedAt from Date to string
                    setProperty({
                        ...propertyData,
                        createdAt: propertyData.createdAt instanceof Date
                            ? propertyData.createdAt.toISOString()
                            : propertyData.createdAt,
                        updatedAt: propertyData.updatedAt instanceof Date
                            ? propertyData.updatedAt.toISOString()
                            : propertyData.updatedAt,
                    });
                }
            } catch (error) {
                console.error("Error fetching property data:", error);
            }
        };
        fetchData();
    }, [params.id, router]);

    if (!property) return <p>Loading...</p>;

    return (
        <section>
            <h1 className="text-2xl font-semibold mb-8 capitalize">Edit Property</h1>
            <div className="border p-8 rounded-md">
                <FormContainer action={updatePropertyAction}>
                    <input type="hidden" name="id" value={property.id} />
                    <input type="hidden" name="deletedImages" value={deletedImages.join(",")} />
                    <input type="hidden" name="image" value={[...property.image, ...uploadedImages].join(",")} />

                    <FormInput name="name" type="text" label="Name" defaultValue={property.name} />
                    <FormInput name="tagline" type="text" label="Tagline" defaultValue={property.tagline} />
                    <PriceInput defaultValue={property.price} />
                    <CategoriesInput defaultValue={property.category} />
                    <CitiesInput defaultValue={property.city} />
                    <FormInput name="googleMapsUrl" type="text" label="Google Maps URL" defaultValue={property.googleMapsUrl} />

                    <TextAreaInput name="description" labelText="Description" defaultValue={property.description} />

                    <SubmitButton text="Edit Property" />
                </FormContainer>
            </div>
        </section>
    );
}

export default EditRentalPage;
