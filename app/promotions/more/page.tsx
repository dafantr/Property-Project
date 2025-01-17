'use client';
import { useState, useEffect } from 'react';
import { fetchPromotions } from '@/utils/actions';
import ExclusiveList from '@/components/home/ExclusiveList';
import Link from 'next/link';
import Image from 'next/image';

const MorePage = () => {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchPromotions();

            // Sort promotions by 'createdAt' field (newest first)
            const sortedData = data.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setPromotions(sortedData);
            setFilteredPromotions(sortedData);
        };

        fetchData();
    }, []);

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        if (category === '') {
            setFilteredPromotions(promotions);
        } else {
            setFilteredPromotions(promotions.filter((item) => item.category === category));
        }
    };

    return (
        <div className="relative">
            {/* Sticky Section, shifted down by 'top-16' */}
            <div className="sticky top-10 z-10">
                <h3 className="capitalize text-2xl font-bold px-4 py-2">
                    All Exclusive Categories
                </h3>
                <ExclusiveList
                    exclusive={selectedCategory}
                    onCategorySelect={handleCategoryChange}
                />
            </div>

            {/* Promotions Grid */}
            <section className="mt-4 gap-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4">
                {filteredPromotions.map((promotion) => (
                    <article key={promotion.id} className="group relative">
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
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-semibold mt-1">{promotion.title}</h3>
                            </div>
                            <p className="text-sm mt-1 text-muted-foreground">
                                {promotion.subtitle.substring(0, 40)}
                            </p>
                        </Link>
                    </article>
                ))}
            </section>
        </div>
    );
};

export default MorePage;
