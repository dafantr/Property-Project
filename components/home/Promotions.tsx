'use client';
import { useState, useEffect } from 'react';
import { fetchPromotions } from '@/utils/actions';
import Link from 'next/link';
import Image from 'next/image';

// Define type for promotions
interface PromotionItem {
    id: string;
    category: string;
    description: string;
    createdAt: string; // Ensure this matches the expected type
    title: string;
    media: string;
    subtitle: string;
}

const Promotions = ({ exclusiveCategory }: { exclusiveCategory?: string }) => {
    // Explicitly set the type of state
    const [promotions, setPromotions] = useState<PromotionItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPromotions();

            // Convert `createdAt` to string before setting state
            const formattedData: PromotionItem[] = data.map((promotion) => ({
                ...promotion,
                createdAt: new Date(promotion.createdAt).toISOString(), // Convert Date to string
            }));

            // If a category is provided, filter promotions by category
            const filteredPromotions = exclusiveCategory
                ? formattedData.filter((promotion) => promotion.category === exclusiveCategory)
                : formattedData;

            // Sort promotions by 'createdAt' field (newest first)
            const sortedData = filteredPromotions.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setPromotions(sortedData);
        };

        fetchData();
    }, [exclusiveCategory]); // Re-fetch promotions whenever the category changes

    return (
        <div className="mt-5 mb-5">
            <section className="mt-4 gap-8 grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {/* Display only 4 promotions, newest ones first */}
                {promotions.slice(0, 4).map((promotion) => (
                    <article className="group relative" key={promotion.id}>
                        <Link href={`/promotions/${promotion.id}`}>
                            <div className="relative h-[300px] mb-2 overflow-hidden rounded-md">
                                <Image
                                    src={promotion.media}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
                                    alt={promotion.title}
                                    className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex justify-center items-center">
                                <h3 className="text-sm font-semibold mt-1">{promotion.title}</h3>
                            </div>
                            <p className="text-justify text-sm mt-1 text-muted-foreground">
                                {promotion.subtitle.substring(0, 500)}
                            </p>
                        </Link>
                    </article>
                ))}
            </section>

            {/* View More Button */}
            <div className="flex justify-end mt-4 px-4">
                <a
                    href="/promotions/more"
                    className="flex items-center border py-2 px-6 gap-2 rounded inline-flex hover:bg-opacity-10 transition"
                    style={{
                        color: 'rgba(194, 171, 125, 1)', // Text and icon color
                        borderColor: 'rgba(194, 171, 125, 1)', // Border color
                        backgroundColor: 'transparent',
                    }}
                >
                    <span>View More</span>
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                </a>
            </div>
        </div>
    );
};

export default Promotions;