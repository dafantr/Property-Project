'use client';
import { useState, useEffect } from 'react';
import { fetchGalleries } from '@/utils/actions';

// Define the type for the gallery items
interface TestimonialItem {
    id: string;
    createdAt: string; // Ensure createdAt is a string
    title: string;
    media: string;
}

const MemberReviews = () => {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data: { id: string; createdAt: Date; title: string; media: string; }[] = await fetchGalleries();

            // Convert 'createdAt' from Date to string before setting state
            const formattedData: TestimonialItem[] = data.map((testimonial) => ({
                ...testimonial,
                createdAt: testimonial.createdAt.toISOString(), // Convert Date to ISO string
            }));

            // Ensure 'createdAt' is properly converted to Date before sorting
            const sortedData = formattedData.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setTestimonials(sortedData);
        };

        fetchData();
    }, []);

    return (
        <div className="mt-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 p-4">
                {testimonials.slice(0, 8).map((testimonial) => (
                    <div key={testimonial.id} className="group">
                        <img
                            src={testimonial.media}
                            alt={testimonial.title}
                            className="w-full h-52 object-cover rounded-md shadow-lg cursor-pointer transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="flex flex-col items-center mt-4 px-4">
                            <p className="mt-1 text-sm underline font-bold">"Testimonial Title"</p>
                            <p className="mt-3 text-sm">"Testimonial Description"</p>
                            <p className="mt-1 text-sm">Testimonial Author</p>
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
                    <span>See More</span>
                </a>
            </div>
        </div>
    );
};

export default MemberReviews;