import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper/types";
import "swiper/css";
import "swiper/css/free-mode";

interface PremiumContentSwiperProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  slidesPerView?: number | "auto";
  spaceBetween?: number;
  onSwiper?: (swiper: SwiperType) => void;
  onSlideChange?: (swiper: SwiperType) => void;
  hasOverlayLeft?: boolean;
  hasOverlayRight?: boolean;
}

const PremiumContentSwiper = <T,>({
  data,
  renderItem,
  spaceBetween = 3,
  onSwiper,
  onSlideChange,
  hasOverlayLeft = false,
  hasOverlayRight = true,
}: PremiumContentSwiperProps<T>) => {
  return (
    <div className="relative z-10">
      <Swiper
        spaceBetween={spaceBetween}
        slidesPerView="auto"
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        className="premium-swiper"
      >
        {data.map((item, index) => (
          <SwiperSlide key={index} className="!w-auto">
            <div className="pr-4">
              {renderItem(item)}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {hasOverlayLeft && (
        <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-5" />
      )}
      {hasOverlayRight && (
        <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-5" />
      )}
    </div>
  );
};

export default PremiumContentSwiper;
