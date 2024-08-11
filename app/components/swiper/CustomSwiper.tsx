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
  overlayLeftClassName?: string;
  overlayRightClassName?: string;
  swiperProps?: Record<string, any>;
}

const CustomSwiper = <T,>({
  data,
  renderItem,
  slidesPerView = "auto",
  spaceBetween = 16,
  onSwiper,
  onSlideChange,
  hasOverlayLeft = false,
  hasOverlayRight = false,
  className = "",
  slideClassName = "",
  overlayLeftClassName = "absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-5",
  overlayRightClassName = "absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white to-transparent z-5 xl:hidden",
}: CustomSwiperProps<T>) => {
  return (
    <div className="relative w-full">
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        className={`custom-swiper w-full ${className}`}
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className={`!w-auto ${slideClassName}`}>
            {renderItem(item)}
          </SwiperSlide>
        ))}
      </Swiper>
      {hasOverlayLeft && <div className={overlayLeftClassName} />}
      {hasOverlayRight && <div className={overlayRightClassName} />}
    </div>
  );
};

export default CustomSwiper;
