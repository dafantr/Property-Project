"use client";

import { useState, useEffect } from "react";
import { fetchProperties, fetchPropertyRating } from "@/utils/actions";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/utils/format";
import PropertyRating from "@/components/card/PropertyRating";
import CityFlagAndName from "@/components/card/CityFlagAndName";
import MorePropertiesList from "@/components/home/MorePropertiesList";
import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import MorePropertiesLoading from "./loading";
import EmptyList from "./EmptyList";
import { useSearchParams } from "next/navigation";

const MorePropertiesPage = () => {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get("search") || ""; // Get the search query from the URL

    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Start loading
            try {
                const data = await fetchProperties({
                    search: searchQuery, // Pass search query from URL
                    category: selectedCategory || undefined,
                });

                // Fetch ratings for all properties
                const propertiesWithRatings = await Promise.all(
                    data.map(async (property) => {
                        const { rating, count } = await fetchPropertyRating(property.id);
                        return { ...property, rating, count };
                    })
                );

                setProperties(propertiesWithRatings);
                setFilteredProperties(propertiesWithRatings);
            } catch (error) {
                console.error("Error fetching properties:", error);
            } finally {
                setIsLoading(false); // End loading
            }
        };

        fetchData();
    }, [searchQuery, selectedCategory]); // Refetch when search query or category changes

    const handleCategoryChange = (category: string) => {
        if (category === selectedCategory) {
            // If the same category is clicked, reset to show all properties
            setSelectedCategory("");
            setFilteredProperties(properties); // Reset the filter to show all properties
        } else {
            // Otherwise, filter properties by the selected category
            setSelectedCategory(category);
            const filtered = properties.filter((item) => item.category === category);
            setFilteredProperties(filtered);
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
                    onButtonClick={() => handleCategoryChange("")} // Clear filters
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
                    <article key={property.id} className="group relative">
                        <Link href={`/properties/${property.id}`}>
                            <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
                                <Image
                                    src={property.image}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                                    alt={property.name}
                                    className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold mt-1">{property.name}</h3>
                                <PropertyRating inPage={false} rating={property.rating} count={property.count} />
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">{property.tagline.substring(0, 40)}</p>
                            <div className="flex justify-between items-center mt-1">
                                <p className="text-sm mt-1">
                                    <span className="font-semibold">{formatCurrency(property.price)} </span>
                                    / Night
                                </p>
                                <CityFlagAndName cityCode={property.city} />
                            </div>
                        </Link>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default MorePropertiesPage;
