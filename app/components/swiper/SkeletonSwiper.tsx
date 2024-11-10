import ItemCardSkeleton from "@/app/components/skeletons/ItemCardSkeleton";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

interface Props {
  count?: number;
}

const SkeletonSwiper = ({ count = 4 }: Props) => {
  return (
    <Swiper slidesPerView="auto" spaceBetween={5} className="mySwiper">
      {[...Array(count)].map((_, index) => (
        <SwiperSlide key={index} style={{ width: "230px" }}>
          <ItemCardSkeleton />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SkeletonSwiper;
