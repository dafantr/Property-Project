'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function OverviewHero() {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg">Welcome,</h2>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg mt-2">
              You Are Now Part of MDV Regular Member.
          </h2>

          <p className="text-lg sm:text-xl md:text-2xl font-bold mt-4 drop-shadow-md leading-relaxed">
              Join the MDV Next Step Membership Program
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-bold mt-1 drop-shadow-md leading-relaxed">
              and Enjoy Exclusive Rewards.
          </p>

          <a
              href="/member/create"
              className="mt-3 flex items-center  py-2 px-6 gap-2 rounded inline-flex hover:bg-opacity-10 transition"
              style={{
                  color: 'rgb(255, 255, 255)', // Text and icon color
                  backgroundColor: 'rgba(194, 171, 125, 1)',
              }}
          >
              <span>Sign Up Now</span>
          </a>
      </div>
      <div className="w-screen h-[80vh] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, EffectFade]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          effect="fade"
          speed={800}
          className="w-full h-full"
        >
          <SwiperSlide>
            <img
              src="/icons/hero1.jpg"
              alt="Hero Slide 1"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/icons/hero2.png"
              alt="Hero Slide 2"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="/icons/hero3.png"
              alt="Hero Slide 3"
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default OverviewHero;
