"use client";

import React, { useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import HeroLink, { HeroLinkProps } from "../HeroLink";

interface HeroSwiperProps {
  onSwiper: (swiper: SwiperType) => void;
  slides: HeroLinkProps[];
}

const HeroSwiper = ({ onSwiper, slides }: HeroSwiperProps) => {
  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      onSwiper(swiper);
    },
    [onSwiper]
  );

  const handleSlideChange = (swiper: SwiperType) => {
    onSwiper(swiper);
  };

  return (
    <div className="relative">
      <Swiper
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        modules={[Navigation]}
        spaceBetween={20}
        slidesPerView={1}
      >
        {slides.map((slide, index) => (
          <SwiperSlide
            key={index}
            className="w-full bg-green-50 bg-opacity-20 rounded-lg px-4"
          >
            <HeroLink {...slide} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSwiper;
