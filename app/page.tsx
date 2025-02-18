//"use client";
import CategoriesList from '@/components/home/CategoriesList';
import PropertiesContainer from '@/components/home/PropertiesContainer';
import LoadingCards from '@/components/card/LoadingCards';
import { Suspense, useEffect } from 'react';
import FeatureHighlights from '@/components/features/FeatureHighlights';
import SectionHeading from '@/components/helper/SectionHeading';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Hero from '@/components/hero/Hero';
import TestimonialCard from '@/components/testimonial/TestimonialCard';
import ContactUs from '@/components/contactus/ContactUs';
import Galleries from '@/components/home/Galleries';
import Promotions from '@/components/home/Promotions';
import ExclusiveList from '@/components/home/ExclusiveList';
import ExclusiveContainer from '@/components/home/ExclusiveContainer';

function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string; exclusive?: string; };
}) {
  return (
    <section>
      <Hero />
      <div id="about">
        <FeatureHighlights />
      </div>
      <div id="gallery">
        <SectionHeading
          heading="Gallery"
          paragraph="Explore stunning visuals of our properties, facilities, and the breathtaking scenery surrounding MDV."
        />
        <Galleries />
      </div>
      <div id="villas">
        <SectionHeading
          heading="Property Types"
          paragraph="At Million Dollar View Villas, we offer a variety of 
                  unique villa types, each designed to provide a luxurious and memorable
                   experience. Whether you're looking for a rustic cabin surrounded by 
                   nature or a spacious warehouse with an industrial charm, we have the 
                   perfect stay for you."
        />
        <CategoriesList
          category={searchParams?.category}
          search={searchParams?.search}
        />
        <Suspense fallback={<LoadingCards />}>
          <PropertiesContainer
            category={searchParams?.category}
            search={searchParams?.search}
          />
        </Suspense>
      </div>
      <div id="highlights" className="mt-10 mb-10">
        <SectionHeading
          heading="Exclusive Highlights"
          paragraph="Discover the exceptional moments and unique offerings that make your experience with us truly unforgettable. From personalized services to once-in-a-lifetime events, explore what sets us apart and elevates your stay to something extraordinary."
        />
        <ExclusiveList 
          exclusive={searchParams?.exclusive} 
        />
        <ExclusiveContainer 
          exclusive={searchParams?.exclusive} 
        />
      </div>
      <div id="testimony">
        <TestimonialCard />
      </div>
      <div id="contact">
        <ContactUs />
      </div>
    </section>
  );
}

export default HomePage;

