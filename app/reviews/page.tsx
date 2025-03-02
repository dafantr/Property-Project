"use client";

import { useEffect, useState } from "react";
import EmptyList from "@/components/home/EmptyList";
import { fetchPropertyReviewsByUser } from "@/utils/actions";
import ReviewCard from "@/components/reviews/ReviewCard";
import Title from "@/components/properties/Title";
import DeleteItemButton from "@/components/popupmessage/DeleteItemButton";

// 🔹 Define TypeScript type for reviews
type Review = {
  id: string;
  comment: string;
  rating: number;
  property: {
    name: string;
    image: string[]; // Assuming image is an array of strings
  };
};

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]); // ✅ Explicitly type the state

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data: Review[] = await fetchPropertyReviewsByUser(); // ✅ Ensure function returns typed data
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    loadReviews();
  }, []);

  if (reviews.length === 0)
    return <EmptyList heading="No Reviews Found" message="You haven't reviewed any properties yet." />;

  return (
    <>
      <Title text="Your Reviews" />
      <section className="grid md:grid-cols-2 gap-8 mt-4">
        {reviews.map((review) => {
          const { id, comment, rating, property } = review;
          const { name, image } = property;
          const reviewInfo = {
            comment,
            rating,
            name,
            image: Array.isArray(image) && image.length > 0 ? image[0] : "", // ✅ Ensure correct access
          };

          return (
            <ReviewCard key={id} reviewInfo={reviewInfo}>
              <DeleteItemButton
                itemId={id}
                itemType="review"
                onDelete={() => setReviews((prev) => prev.filter((r) => r.id !== id))} // ✅ Update state after delete
              />
            </ReviewCard>
          );
        })}
      </section>
    </>
  );
}
