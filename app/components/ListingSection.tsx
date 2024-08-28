"use client";

import React, { useRef, useState } from "react";
import TopRatedBadge from "./badges/TopRatedBadge";
import ProBadge from "./badges/Probadge";
import LevelBadge from "./badges/Levelbadge";
import ItemCard from "./ItemCard";
import CustomSwiper from "./swiper/CustomSwiper";
import Heading from "./Heading";
import SubHeading from "./SubHeading";
import { Swiper as SwiperType } from "swiper/types";
import Link from "next/link";

interface Slide {
  type: "image" | "video";
  url: string;
}

interface Category {
  title: string;
  slides: Slide[];
  name: string;
  price: number;
  profileImgUrl: string;
  rating: number;
  Badge: React.ComponentType<any>;
  offersVideo: boolean;
}

interface ListingSectionProps {
  heading: string;
  href: string;
  subheading: string;
  categories: Category[];
}

const ListingSection = ({
  heading,
  href,
  subheading,
  categories,
}: ListingSectionProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handlePrev = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  return (
    <div className="flex flex-col space-y-6">
      <Heading label={heading} />
      <div className="flex items-center gap-2 justify-between">
        <SubHeading label={subheading} />
        <Link href={href} className="font-semibold underline whitespace-nowrap">
          Show All
        </Link>
      </div>

      <div className="relative w-full">
        <CustomSwiper
          data={categories}
          renderItem={(item: Category) => (
            <div className="w-[240px]">
              <ItemCard
                title={item.title}
                slides={item.slides}
                name={item.name}
                price={item.price}
                profileImgUrl={item.profileImgUrl}
                rating={item.rating}
                Badge={item.Badge}
                offersVideo={item.offersVideo}
              />
            </div>
          )}
          hasOverlayRight={true}
          overlayRightClassName="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10 xl:hidden"
          className="vehicules-motor-swiper"
          slideClassName="pr-4"
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
            handleSlideChange(swiper);
          }}
          onSlideChange={handleSlideChange}
        />

        <button
          className={`prev-button absolute -left-10 top-1/2 transform -translate-y-1/2 bg-white transition-colors hover:bg-gray-50 rounded-full z-20 w-12 h-12 flex items-center justify-center shadow-md ${
            isBeginning ? "hidden" : ""
          }`}
          onClick={handlePrev}
        >
          <svg
            width="8"
            height="15"
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 8 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.2279 0.690653L7.84662 1.30934C7.99306 1.45578 7.99306 1.69322 7.84662 1.83968L2.19978 7.5L7.84662 13.1603C7.99306 13.3067 7.99306 13.5442 7.84662 13.6907L7.2279 14.3094C7.08147 14.4558 6.84403 14.4558 6.69756 14.3094L0.153374 7.76518C0.00693607 7.61875 0.00693607 7.38131 0.153374 7.23484L6.69756 0.690653C6.84403 0.544184 7.08147 0.544184 7.2279 0.690653Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <button
          onClick={handleNext}
          className={`next-button absolute -right-5 top-1/2 transform -translate-y-1/2 bg-white transition-colors hover:bg-gray-50 rounded-full z-20 w-12 h-12 flex items-center justify-center shadow-md ${
            isEnd ? "hidden" : ""
          }`}
        >
          <svg
            width="8"
            height="15"
            className="h-4 w-4 text-gray-600"
            viewBox="0 0 8 15"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.772102 14.3093L0.153379 13.6906C0.00694026 13.5442 0.00694026 13.3067 0.153379 13.1603L5.80022 7.5L0.153379 1.83967C0.00694026 1.69323 0.00694026 1.45577 0.153379 1.30931L0.772102 0.690585C0.918534 0.544151 1.15598 0.544151 1.30242 0.690585L7.84661 7.23482C7.99307 7.38125 7.99307 7.61869 7.84661 7.76516L1.30242 14.3093C1.15598 14.4558 0.918534 14.4558 0.772102 14.3093Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ListingSection;
