"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";

interface Props {
  count?: number;
}

const SkeletonListingSection = ({ count = 5 }: Props) => {
  return (
    <div className="flex flex-col space-y-6 px-4 py-5 bg-[#fafafa]">
      <div className="h-8 bg-gray-200 rounded w-1/3 animate-pulse"></div>
      <div className="flex items-center gap-2 justify-between">
        <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Swiper
          spaceBetween={3}
          slidesPerView="auto"
          className="listing-swiper"
        >
          {[...Array(count)].map((_, index) => (
            <SwiperSlide key={index} className="!w-auto">
              <div className="w-[240px]">
                <div className="pr-4">
                  <div className="h-40 bg-gray-200 rounded animate-pulse"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="mt-1 h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default SkeletonListingSection;
