'use client';
import { useState, useEffect } from 'react';
import { fetchPromotions } from '@/utils/actions';
import ExclusiveList from '@/components/home/ExclusiveList';
import Link from 'next/link';
import Image from 'next/image';
import MorePropertiesLoading from './loading';
import EmptyList from './EmptyList';
import LoadingSkeleton from './loading';
import MoreExclusiveList from '@/components/home/MoreExclusiveList';

const MorePage = () => {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPromotions();

                const sortedData = data.sort(
                    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );

                setPromotions(sortedData);
                setFilteredPromotions(sortedData);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleCategoryChange = (category: string) => {
        if (category === selectedCategory) {
            // If the same category is clicked, clear the search and reset filter
            setSelectedCategory('');
            setSearchQuery('');
            setFilteredPromotions(promotions); // Show all promotions again
        } else {
            setSelectedCategory(category);
            filterPromotions(category, searchQuery); // Filter by the selected category
        }
    };

    const handleSearchChange = (query: string) => {
        setSearchQuery(query);
        filterPromotions(selectedCategory, query);
    };

    const filterPromotions = (category: string, query: string) => {
        let filtered = promotions;

        if (category) {
            filtered = filtered.filter((item) => item.category === category);
        }

        if (query) {
            filtered = filtered.filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase()) ||
                item.subtitle.toLowerCase().includes(query.toLowerCase())
            );
        }

        setFilteredPromotions(filtered);
    };

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (filteredPromotions.length === 0) {
        return (
            <div className="relative">
                <div className="sticky top-10 z-10 rounded-xl bg-white dark:bg-[#0c0a09]">
                    <h3 className="capitalize text-2xl font-bold px-4 py-2">
                        All Exclusive Categories
                    </h3>
                    <MoreExclusiveList
                        selectedCategory={selectedCategory}
                        onCategorySelect={handleCategoryChange}
                    />
                </div>
                <EmptyList heading="No results." message="Try different filters or clear them." />
            </div>
        );
    }

    return (
        <div className="relative">
            <div className="sticky top-10 z-10 rounded-xl bg-white dark:bg-[#0c0a09]">
                <h3 className="capitalize text-2xl font-bold px-4 py-2">
                    All Exclusive Categories
                </h3>
                <MoreExclusiveList
                    selectedCategory={selectedCategory}
                    onCategorySelect={handleCategoryChange}
                />
            </div>

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
