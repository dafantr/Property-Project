import { FaStar } from "react-icons/fa";

function PropertyRating({
  rating,
  count,
  inPage,
}: {
  rating: number;
  count: number;
  inPage: boolean;
}) {
  if (rating == null || count == null || count === 0) return null;

  // Display stars for rating
  const ratingStars = Array.from({ length: 5 }, (_, i) => (
    <FaStar
      key={i}
      className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-500" : "text-gray-300"}`}
    />
  ));

  const countText = count === 1 ? "review" : "reviews";
  const countValue = `(${count}) ${inPage ? countText : ""}`;

  return (
    <div className="flex items-center gap-1">
      <div className="flex gap-1">{ratingStars}</div>
      <span className="text-sm">{rating} {countValue}</span>
    </div>
  );
}

export default PropertyRating;
