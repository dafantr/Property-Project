"use client";

import { useState, useEffect } from "react";
import { fetchProperties, fetchPropertyRating } from "@/utils/actions";
import PropertyCard from "@/components/card/PropertyCard";
import MorePropertiesList from "@/components/home/MorePropertiesList";
import MorePropertiesLoading from "./loading";
import EmptyList from "./EmptyList";
import { useSearchParams } from "next/navigation";
import { PropertyCardProps } from "@/utils/types";

type PropertyWithRatings = PropertyCardProps & {
    rating: number | null;
    count: number;
    category: string;
    createdAt: string;
};

const MorePropertiesPage = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || "";

    // ✅ Define the correct types
    const [properties, setProperties] = useState<PropertyWithRatings[]>([]);
    const [filteredProperties, setFilteredProperties] = useState<PropertyWithRatings[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const data = await fetchProperties({
                    search: searchQuery,
                    category: selectedCategory || undefined,
                });

                const propertiesWithRatings: PropertyWithRatings[] = await Promise.all(
                    data.map(async (property) => {
                        const { rating, count } = await fetchPropertyRating(property.id);
                
                        return {
                            ...property,
                            createdAt: new Date(property.createdAt).toISOString(),
                            rating: typeof rating === "number" ? rating : null,
                            count: count ?? 0,
                            category: property.category || "",
                        };
                    })
                );                

                setProperties(propertiesWithRatings);
                setFilteredProperties(propertiesWithRatings);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [searchQuery, selectedCategory]);

    // ✅ Ensure category filtering works correctly
    const handleCategoryChange = (category: string) => {
        if (category === selectedCategory) {
            setSelectedCategory("");
            setFilteredProperties(properties);
        } else {
            setSelectedCategory(category);
            setFilteredProperties(properties.filter((item) => item.category === category));
        }
    };

    if (isLoading) {
        return <MorePropertiesLoading />;
    }

    if (filteredProperties.length === 0) {
        return (
            <div className="relative">
                <div className="sticky top-10 z-10 rounded-xl bg-white dark:bg-[#0c0a09]">
                    <h3 className="capitalize text-2xl font-bold px-4 py-2">All Property Categories</h3>
                    <MorePropertiesList category={selectedCategory} onCategorySelect={handleCategoryChange} />
                </div>
                <EmptyList
                    heading="No results."
                    message="Try finding a different property or removing some filters."
                    btnText="Clear Filters"
                    onButtonClick={() => handleCategoryChange("")} // ✅ Ensure Clear Filters Works
                />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="sticky top-10 z-10 rounded-xl bg-white dark:bg-[#0c0a09]">
                <h3 className="capitalize text-2xl font-bold px-4 py-2">All Property Categories</h3>
                <MorePropertiesList category={selectedCategory} onCategorySelect={handleCategoryChange} />
            </div>
            <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} hidePrice={false} hideDetails={true} />
                ))}

            </section>

        </div>
    );
};

export default MorePropertiesPage;