'use client'; // Required for client-side rendering
import { useState, useEffect } from 'react';
import { fetchPromotions } from '@/utils/actions';
import Link from 'next/link';
import Image from 'next/image';
import { exclusiveCategories } from '@/utils/exclusiveCategories';

const Promotions = ({ exclusiveCategory }: { exclusiveCategory?: string }) => {
    const [promotions, setPromotions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch all promotions first
            const data = await fetchPromotions();

            // If a category is provided, filter promotions by category
            const filteredPromotions = exclusiveCategory
                ? data.filter((promotion) => promotion.category === exclusiveCategory)
                : data;

            // Sort promotions by 'createdAt' field (newest first)
            const sortedData = filteredPromotions.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setPromotions(sortedData);
        };

        fetchData();
    }, [exclusiveCategory]); // Re-fetch promotions whenever the exclusiveCategory changes

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

            <div className="flex justify-end mt-4 px-4">
                <a
                    href="/promotions/more"
                    className="flex items-center text-orange-600 border border-orange-500 py-2 px-6 gap-2 rounded inline-flex hover:bg-orange-100 transition"
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
