import React from 'react';

const SliderCard = ({ image, name, comment, rating }: { image: string, name: string, comment: string, rating: number }) => {
  return (
    <div className="flex flex-col items-center text-center pt-5">
      <img src={image || "/default-avatar.jpg"} alt={name} className="rounded-full w-24 h-24 object-cover" />
      <h3 className="mt-4 text-lg font-semibold text-black">{name}</h3>
      <p className="text-sm mt-2 text-black">{comment}</p>
      <div className="mt-2">
        {Array.from({ length: rating }).map((_, idx) => (
          <span key={idx} className="text-yellow-500">★</span>
        ))}
      </div>
    </div>
  );
};

export default SliderCard;
