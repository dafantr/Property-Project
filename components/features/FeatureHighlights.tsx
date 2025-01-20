"use client";
import React, { useEffect } from 'react';
import SectionHeading from '../helper/SectionHeading';
import { featureList } from '@/utils/features';
import AOS from 'aos';
import 'aos/dist/aos.css';

function FeatureHighlights() {
  useEffect(() => {
    const initAOS = async () => {
      await import('aos');
      AOS.init({
        duration: 1000,
        easing: 'ease',
        once: true,
        anchorPlacement: 'top-bottom',
      });
    };

    initAOS();
  }, []);

  return (
    <div className="pt-16 pb-16 bg-light dark:bg-dark">
      <div>
        {/* Centering the heading and justifying the paragraph */}
        <div className="w-[80%] mx-auto">
          <SectionHeading
            heading={
              <h2 className="text-center text-3xl font-bold mb-4 text-dark dark:text-light">
                Million Dollar View Villas promises
              </h2>
            }
            paragraph={
              <p className="text-justify text-dark/80 dark:text-light/80">
                Welcome to Million Dollar View Villa (MDV), your luxurious retreat in the heart of Bali. Nestled amidst breathtaking landscapes, MDV offers an unparalleled experience of tranquility, comfort, and elegance. With four exclusive villas, each thoughtfully designed to blend modern sophistication with Balinese charm, we provide the perfect escape for travelers seeking serenity and indulgence.
                At MDV, we pride ourselves on delivering exceptional hospitality and unforgettable experiences. Whether you're soaking in the panoramic views, lounging by a private pool, or exploring the vibrant culture of Bali, our villas are your gateway to a dream vacation.
              </p>
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 md:mt-20 gap-8 items-center">
          {featureList.map((feature, i) => (
            <div
              key={feature.id}
              className="bg-tertiary dark:bg-dark p-6 rounded-lg shadow-md hover:bg-secondary dark:hover:bg-primary/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105 border border-primary/20"
              data-aos="zoom-in"
              data-aos-delay={`${i * 150}`}
              data-aos-anchor-placement="top-center"
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-16 h-16 mx-auto mb-4 icon-color dark:invert dark:opacity-90"
              />
              <h3 className="text-sm text-center font-medium text-dark dark:text-light">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureHighlights;
