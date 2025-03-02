"use client";

import { useState, useEffect } from "react";
import { fetchPropertyReviews } from "@/utils/actions";
import Title from "@/components/properties/Title";
import ReviewCard from "./ReviewCard";

// Define Review and Profile interfaces
interface Profile {
  username: string;
  profileImage: string | null;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  profile: Profile;
}

interface PropertyReviewsProps {
  propertyId: string;
}

const REVIEWS_PER_PAGE = 4;

export default function PropertyReviews({ propertyId }: PropertyReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchPropertyReviews(propertyId, page, REVIEWS_PER_PAGE);
        setReviews(data.reviews);
        setTotalPages(Math.ceil(data.total / REVIEWS_PER_PAGE));
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    loadReviews();
  }, [propertyId, page]);

  if (reviews.length < 1) return null;

  return (
    <div className="mt-8">
      <Title text="Reviews" />
      <div className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            reviewInfo={{
              comment: review.comment,
              rating: review.rating,
              name: review.profile.username,
              image: review.profile.profileImage ?? "/default-profile.jpg",
            }}
          />
        ))}
      </div>

      {/* Pagination UI */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className={`px-4 py-2 rounded-md shadow ${page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Previous
        </button>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`px-3 py-1 rounded-md shadow ${page === index + 1 ? "bg-primary text-white" : "bg-gray-200"}`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className={`px-4 py-2 rounded-md shadow ${page === totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-primary text-white"}`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
