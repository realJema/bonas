"use client";

import React, { useRef, useState } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Swiper as SwiperType } from "swiper/types";

import Link from "next/link";
import { generateSlides } from "@/lib/generateSlides";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import Navigation from "../../swiper/Navigation";
import Heading from "../../Heading";
import CategorySelectionItem from "../../premiumContent/CategorySelectItem/CategorySelectionItem";
import CustomSwiper from "../../swiper/CustomSwiper";
import SkeletonSwiper from "../../swiper/SkeletonSwiper";
import ItemCard from "../../ItemCard";


interface SlideItem {
  type: "image" | "video";
  url: string;
}

interface Category {
  label: string;
  icon: string;
}

interface Props {
  initialListings: ExtendedListing[];
  categories: Category[];
  onCategoryChange: (category: string) => Promise<ExtendedListing[]>;
}

const PremiumContent = ({
  initialListings,
  categories,
  onCategoryChange,
}: Props) => {
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].label);
  const [listings, setListings] = useState(initialListings);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = async (category: Category) => {
    if (category.label !== selectedCategory) {
      setSelectedCategory(category.label);
      setIsLoading(true);
      try {
        const newListings = await onCategoryChange(category.label);
        setListings(newListings);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false); // Setting loading to false after fetching (whether it succeeded or failed)
      }
    }
  };

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

  const getCategoryUrl = (category: string) => {
    const encodedCategory = encodeURIComponent(category);
    return `/categories/${encodedCategory}`;
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <Heading label="Explore popular categories on Bonas" />
        <div className="flex items-center gap-4">
          <Link
            href={getCategoryUrl(selectedCategory)}
            className="font-semibold underline whitespace-nowrap"
          >
            Show All
          </Link>
          <Navigation
            onNext={handleNext}
            onPrev={handlePrev}
            isBeginning={isBeginning}
            isEnd={isEnd}
            containerStyles="hidden md:flex z-10"
          />
        </div>
      </div>
      <div className="flex gap-5">
        <div className="w-[265px] min-w-[240px] mt-7">
          <div className="col-span-3 flex flex-col gap-3">
            {categories.map((category) => (
              <CategorySelectionItem
                key={category.label}
                icon={category.icon}
                label={category.label}
                isSelected={selectedCategory === category.label}
                onClick={() => handleCategoryChange(category)}
              />
            ))}
          </div>
        </div>

        <div className="flex-grow w-full relative mt-7">
          <div className="absolute inset-0 -right-[2vw] lg:-right-[1.5vw] overflow-visible">
            {isLoading ? (
              <SkeletonSwiper />
            ) : (
              <CustomSwiper
                data={listings}
                renderItem={(listing: ExtendedListing) => (
                  <div className="w-[235px]">
                    <ItemCard
                      listing={listing}
                      slides={generateSlides(listing)}
                    />
                  </div>
                )}
                spaceBetween={3}
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                  handleSlideChange(swiper);
                }}
                onSlideChange={handleSlideChange}
                hasOverlayLeft={false}
                hasOverlayRight={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumContent;
