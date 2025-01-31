import FavoriteToggleButton from "@/components/card/FavoriteToggleButton";
import PropertyRating from "@/components/card/PropertyRating";
import Amenities from "@/components/properties/Amenities";
//import BookingCalender from "@/components/properties/booking/BookingCalender";
//import App from "@/components/properties/booking/BookingCalender";
import BreadCrumbs from "@/components/properties/BreadCrumbs";
import Description from "@/components/properties/Description";
import ImageContainer from "@/components/properties/ImageContainer";
import PropertyDetails from "@/components/properties/PropertyDetails";
import ShareButton from "@/components/properties/ShareButton";
import UserInfo from "@/components/properties/UserInfo";
import PropertyReviews from "@/components/reviews/PropertyReviews";
import SubmitReview from "@/components/reviews/SubmitReview";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchPropertyDetails, findExistingReview } from "@/utils/actions";
import { Separator } from "@radix-ui/react-dropdown-menu";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { auth } from '@clerk/nextjs/server';
import { findCityByCode } from "@/utils/cities";

const DynamicMap = dynamic(
  () => import('@/components/properties/PropertyMap'),
  {
    ssr: false,
    loading: () => <Skeleton className='h-[400px] w-full' />,
  }
);

const DynamicBookingWrapper = dynamic(
  () => import('@/components/booking/BookingWrapper'),
  {
    ssr: false,
    loading: () => <Skeleton className='h-[200px] w-full' />,
  }
);

async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await fetchPropertyDetails(params.id);
  if (!property) redirect("/");

  const { baths, bedrooms, beds, guests, rating, count, googleMapsUrl, city } = property;
  const details = { baths, bedrooms, beds, guests };
  const userName = property.profile.username;
  const profileImage = property.profile.profileImage;

  const { userId } = auth();
  const isNotOwner = property.profile.clerkId !== userId;
  const reviewDoesNotExist =
    userId && isNotOwner && !(await findExistingReview(userId, property.id));

  // Fetch the city name using the city code
  const cityDetails = findCityByCode(city);
  const cityName = cityDetails ? cityDetails.name : city; // Fallback to code if city is not found

  return (
    <section>
      <BreadCrumbs name={property.name} />
      <header className="flex justify-between items-center mt-4">
        <h1 className="text-4xl font-bold capitalize">{property.tagline}</h1>
        <div className="flex items-center gap-x-4">
          <ShareButton name={property.name} id={property.id} type="properties" />
          <FavoriteToggleButton propertyId={property.id} />
        </div>
      </header>
      <ImageContainer mainImage={property.image} name={property.name} />

      <section className="lg:grid lg:grid-cols-12 gap-x-12 mt-12">
        <div className="lg:col-span-8">
          <div className="flex gap-x-4 items-center">
            <h1 className="text-xl font-bold">{property.name}</h1>
            <PropertyRating inPage={true} rating={rating ?? 0} count={count ?? 0} />
          </div>
          <PropertyDetails details={details} />
          <UserInfo profile={{ userName, profileImage }} />
          <Separator className="mt-4" />
          <Description description={property.description} />
          <Amenities amenities={property.amenities} />

          {/* Show city location always */}
          <div className="mt-6">
            <h3 className="text-lg font-bold mb-2">Where will you be staying</h3>
            <p className="font-light text-sm capitalize">City: {cityName}</p>
          </div>

          {/* Show Google Map only if googleMapsUrl exists */}
          {property.googleMapsUrl && (
            <iframe
              src={property.googleMapsUrl}
              width="100%"
              height="400"
              allowFullScreen
              loading="lazy"
              className="rounded-md shadow-md mt-4"
            />
          )}
        </div>
        <div className="lg:col-span-4 flex flex-col items-center">
          <DynamicBookingWrapper
            propertyId={property.id}
            price={property.price}
            bookings={property.bookings}
          />
        </div>
      </section>

      {reviewDoesNotExist && <SubmitReview propertyId={property.id} />}
      <PropertyReviews propertyId={property.id} />
    </section>
  );
}

export default PropertyDetailsPage;


