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

const MorePropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchProperties({ search: "", category: selectedCategory || undefined });

            // Fetch ratings for all properties
            const propertiesWithRatings = await Promise.all(
                data.map(async (property) => {
                    const { rating, count } = await fetchPropertyRating(property.id);
                    return { ...property, rating, count };
                })
            );

            setProperties(propertiesWithRatings);
            setFilteredProperties(propertiesWithRatings);
        };

        fetchData();
    }, [selectedCategory]);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === "") {
            setFilteredProperties(properties);
        } else {
            const filtered = properties.filter((item) => item.category === category);
            setFilteredProperties(filtered);
        }
    };

    return (
        <div className="relative">
            <div className="sticky top-10 z-10 rounded-xl bg-white dark:bg-[#0c0a09]">
                <h3 className="capitalize text-2xl font-bold px-4 py-2">All Property Categories</h3>
                <MorePropertiesList
                    category={selectedCategory}
                    onCategorySelect={handleCategoryChange}
                />
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
                            {/* <div className="absolute top-5 right-5 z-5">
                                <FavoriteToggleButton propertyId={property.id} />
                            </div> */}
                        </Link>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default MorePropertiesPage;
