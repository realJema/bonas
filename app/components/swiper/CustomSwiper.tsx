"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";

interface CustomSwiperProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  onSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (swiper: SwiperType) => void;
  hasOverlayLeft?: boolean;
  hasOverlayRight?: boolean;
  className?: string;
  slideClassName?: string;
  overlayLeftClassName?: boolean;
  overlayRightClassName?: boolean;
  swiperProps?: Record<string, any>;
}

const CustomSwiper = <T,>({
  data,
  renderItem,
  spaceBetween = 3,
  onSwiper,
  onSlideChange,
  hasOverlayLeft = false,
  hasOverlayRight = true,
}: CustomSwiperProps<T>) => {
  if (!data || data.length === 0) {
    return <div className="text-center py-4">No data available</div>;
  }

  return (
    <div className="relative">
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView='auto'
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        className={`premium-swiper`}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div className="pr-4">{renderItem(item)}</div>
          </SwiperSlide>
        ))}
      </Swiper>
      {hasOverlayLeft && (
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-5" />
      )}
      {hasOverlayRight && (
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10" />
      )}
    </div>
  );
};

export default CustomSwiper;
