'use client';
import { useState, useEffect } from 'react';
import { fetchOverviewContent } from '@/utils/actions';

// Define the type for the gallery items
interface TestimonialItem {
    id: string;
    title: string;
    media: string;
    type: string;
    author: string | null;
    description: string | null;
}

const MemberReviews = () => {
    const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const data: { id: string; title: string; media: string; type: string; author: string | null; description: string | null; }[] = await fetchOverviewContent('review');

            setTestimonials(data);
        };

        fetchData();
    }, []);

    return (
        <div className="mt-5 mb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
                {testimonials.slice(0, 8).map((testimonial) => (
                    <div key={testimonial.id} className="group">
                        <img
                            src={testimonial.media}
                            alt={testimonial.title}
                            className="w-full h-72 object-cover rounded-md shadow-lg cursor-pointer transform group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="flex flex-col items-center mt-4 px-4">
                            <p className="mt-1 text-sm underline font-bold">"{testimonial.title}"</p>
                            <p className="mt-3 text-sm text-center">"{testimonial.description}"</p>
                            <p className="mt-1 text-sm">- {testimonial.author}</p>
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