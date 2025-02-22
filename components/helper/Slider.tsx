"use client";
import React, { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import SliderCard from './SliderCard';
import { fetchFiveStarReviews } from '@/utils/actions';

const responsive = {
    desktop: {
        breakpoint: { max: 3000, min: 1324 },
        items: 1,
        slidesToSlide: 1,
    },
    tablet: {
        breakpoint: { max: 1324, min: 764 },
        items: 1,
        slidesToSlide: 1,
    },
    mobile: {
        breakpoint: { max: 764, min: 0 },
        items: 1,
        slidesToSlide: 1,
    },
};

const Slider = () => {
    const [reviews, setReviews] = useState<any[]>([]);

    useEffect(() => {
        async function loadReviews() {
            try {
                const fetchedReviews = await fetchFiveStarReviews();
                setReviews(fetchedReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        }

        loadReviews();
    }, []);

    if (reviews.length === 0) {
        return <p className="text-center text-gray-500">No reviews available.</p>;
    }

    return (
        <div className='relative z-10'>
            <Carousel
                additionalTransfrom={0}
                arrows={true}
                autoPlay={true}
                autoPlaySpeed={3000}
                centerMode={false}
                infinite
                responsive={responsive}
                itemClass="item"
            >
                {reviews.map((review) => {
                    const { comment, rating } = review;
                    const { username, profileImage } = review.profile;

                    return (
                        <SliderCard
                            key={review.id}
                            image={profileImage || ""}
                            name={username}
                            comment={comment}
                            rating={rating}
                        />
                    );
                })}
            </Carousel>
        </div>
    );
};

export default Slider;
