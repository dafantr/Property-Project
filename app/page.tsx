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

function HomePage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
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

