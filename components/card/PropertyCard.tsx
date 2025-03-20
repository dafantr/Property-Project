"use client";
import Image from 'next/image';
import Link from 'next/link';
import PropertyRating from './PropertyRating';
import FavoriteToggleButton from './FavoriteToggleButton';
import { formatCurrency } from '@/utils/format';
import CityFlagAndName from './CityFlagAndName';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { PropertyCardProps } from '@/utils/types';

type PropertyCardComponentProps = {
  property: PropertyCardProps;
  hidePrice?: boolean;
  hideDetails?: boolean;
};

function PropertyCard({ property, hidePrice = false, hideDetails = false }: PropertyCardComponentProps) {
  const { name, image, price, city, id: propertyId, tagline, rating, count, bedrooms, baths, guests } = property;
  console.log("Property Data:", property);

  const imageArray = Array.isArray(image) ? image : [image];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const nextImage = () => setSelectedImageIndex((prevIndex) => (prevIndex + 1) % imageArray.length);
  const prevImage = () => setSelectedImageIndex((prevIndex) => (prevIndex - 1 + imageArray.length) % imageArray.length);

  return (
    <article className="group relative">
      <Link href={`/properties/${propertyId}`}>
        <div className="relative w-full h-[300px] mb-2 overflow-hidden rounded-md">
          <Image
            src={imageArray[selectedImageIndex] || "/path/to/fallback-image.jpg"}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw"
            className="rounded-md object-cover transform group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold mt-1">{name.substring(0, 30)}</h3>
          {rating != null && count != null && (
            <PropertyRating inPage={false} rating={parseFloat(rating.toFixed(1))} count={count} />
          )}
        </div>
        <p className="text-sm mt-1 text-muted-foreground">{tagline.substring(0, 40)}</p>

        {!hidePrice && price !== undefined && (
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm mt-1">
              <span className="font-semibold">{formatCurrency(price)}</span> / Night
            </p>
            <CityFlagAndName cityCode={city} />
          </div>
        )}

        {/* Property Details + City Name */}
        {!hideDetails && (
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-muted-foreground">
              {bedrooms} BedRooms · {baths} Bath · {guests} Guests
            </p>
            <CityFlagAndName cityCode={city} />
          </div>
        )}
      </Link>

      {
        imageArray.length > 1 && (
          <div className="absolute top-[40%] left-2 z-10 transform -translate-y-1/2">
            <button
              onClick={prevImage}
              className="bg-[rgba(194,171,125,1)] text-white p-3 rounded-full hover:bg-[rgba(194,171,125,0.9)] transition"
            >
              ◀
            </button>
          </div>
        )
      }
      {
        imageArray.length > 1 && (
          <div className="absolute top-[40%] right-2 z-10 transform -translate-y-1/2">
            <button
              onClick={nextImage}
              className="bg-[rgba(194,171,125,1)] text-white p-3 rounded-full hover:bg-[rgba(194,171,125,0.9)] transition"
            >
              ▶
            </button>
          </div>
        )
      }

      <div className="absolute top-5 right-5 z-5">
        <FavoriteToggleButton propertyId={propertyId} />
      </div>
    </article >
  );
}

export default PropertyCard;
