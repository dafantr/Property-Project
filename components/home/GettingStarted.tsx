'use client';
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/utils/actions';

// Define the type for the gallery items
interface ContentItem {
    id: string;
    createdAt: string; // Ensure createdAt is a string
    title: string;
    media: string;
}

const GettingStarted = () => {
    const [contents, setContents] = useState<ContentItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data: { id: string; createdAt: Date; title: string; media: string; }[] = await fetchGalleries();

            // Convert 'createdAt' from Date to string before setting state
            const formattedData: ContentItem[] = data.map((content) => ({
                ...content,
                createdAt: content.createdAt.toISOString(), // Convert Date to ISO string
            }));

            // Ensure 'createdAt' is properly converted to Date before sorting
            const sortedData = formattedData.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setContents(sortedData);
        };

        fetchData();
    }, []);

    return (
        <div className="mt-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4">
                {contents.slice(0, 8).map((content) => (
                    <div key={content.id} className="group">
                        <img
                            src={content.media}
                            alt={content.title}
                            className="w-full h-52 object-cover rounded-md shadow-lg cursor-pointer transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="flex flex-col items-center mt-4 px-4">
                            <p className="mt-1 text-sm underline">1. Steps</p>
                            <p className="mt-3 text-sm">2. Steps Description</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* View More button */}
            <div className="flex justify-center mt-4 px-4">
                <a
                    href="/member/create"
                    className="flex items-center border py-2 px-6 gap-2 rounded inline-flex hover:bg-opacity-10 transition"
                    style={{
                        color: 'rgba(194, 171, 125, 1)', // Text and icon color
                        borderColor: 'rgba(194, 171, 125, 1)', // Border color
                        backgroundColor: 'transparent',
                    }}
                >
                    <span>Sign Up Now</span>
                </a>
            </div>
        </div>
    );
};

export default GettingStarted;