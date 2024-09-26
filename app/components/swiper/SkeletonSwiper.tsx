import SkeletonCard from "@/app/categories/[...category]/SkeletonCard";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  count?: number;
}

const SkeletonSwiper = ({ count = 4 }: Props) => {
  return (
    <Swiper slidesPerView="auto" spaceBetween={3} className="mySwiper">
      {[...Array(count)].map((_, index) => (
        <SwiperSlide key={index} style={{ width: "230px" }}>
          <SkeletonCard />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SkeletonSwiper;
