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
  }, [])
  return (
    <div className="pt-16 pb-16">
      <div >
        {/* className="w-[80%] mx-auto" */}
        <SectionHeading
          heading="Million Dollar View Villas promises"
          paragraph=" Discover an extraordinary living experience where luxury meets
                breathtaking scenery. At Million Dollar View Villas, we offer more
                than just a place to stay—we provide a home designed for those who
                seek comfort, style, and unforgettable views."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 mt-10 md:mt-20 gap-8 items-center">
          {featureList.map((feature, i) => (
            <div
              key={feature.id}
              className="bg-card text-card-foreground p-6 rounded-lg shadow-md hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition duration-300"
              data-aos="zoom-in"
              data-aos-delay={`${i * 150}`}
              data-aos-anchor-placement='top-center'
            >
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-16 h-16 mx-auto mb-4 icon-color"
              />
              <h3 className="text-sm text-center">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FeatureHighlights;




