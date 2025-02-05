'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination, EffectFade } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

function Hero() {
  return (
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
  );
}

export default Hero;
