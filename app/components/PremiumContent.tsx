"use client";

import React, { useRef, useState } from "react";
import { Swiper as SwiperInstance } from "swiper";
import { Swiper as SwiperType } from "swiper/types";
import { ExtendedListing } from "../entities/ExtendedListing";
import Heading from "./Heading";
import ItemCard from "./ItemCard";
import CustomSwiper from "./swiper/CustomSwiper";
import Navigation from "./swiper/Navigation";
import Link from "next/link";
import CategorySelectionItem from "./premiumContent/CategorySelectionItem";
import { generateSlides } from "@/lib/generateSlides";
import SkeletonCard from "../categories/[...category]/SkeletonCard";

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

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <Heading label="Explore popular categories on Bonas" />
        <div className="flex items-center gap-4">
          <Link href="#" className="font-semibold underline whitespace-nowrap">
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
        <div className="w-[265px] min-w-[250px] mt-7">
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
              <div className="flex gap-4">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="w-[230px]">
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            ) : (
              <CustomSwiper
                data={listings}
                renderItem={(listing: ExtendedListing) => (
                  <div className="w-[230px]">
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

// "use client";

// import React, { useRef, useState, useEffect } from "react";
// import { Swiper as SwiperInstance } from "swiper";
// import { Swiper as SwiperType } from "swiper/types";
// import { ExtendedListing } from "../entities/ExtendedListing";
// import Heading from "./Heading";
// import ItemCard from "./ItemCard";
// import CustomSwiper from "./swiper/CustomSwiper";
// import Navigation from "./swiper/Navigation";
// import Link from "next/link";
// import CategorySelectionItem from "./premiumContent/CategorySelectionItem";

// interface SlideItem {
//   type: "image" | "video";
//   url: string;
// }

// interface Props {
//   listings: ExtendedListing[];
//   generateSlides: (listing: ExtendedListing) => SlideItem[];
//   onCategoryChange: (category: string) => Promise<ExtendedListing[]>;
// }

// const PremiumContent = ({
//   listings: initialListings,
//   generateSlides,
//   onCategoryChange,
// }: Props) => {
//   const swiperRef = useRef<SwiperInstance | null>(null);
//   const [isBeginning, setIsBeginning] = useState(true);
//   const [isEnd, setIsEnd] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("Electronics");
//   const [listings, setListings] = useState(initialListings);

  // const categories = [
  //   {
  //     label: "Electronics",
  //     icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
  //   },
  //   {
  //     label: "Real Estate",
  //     icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
  //   },
  //   {
  //     label: "Jobs",
  //     icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
  //   },
  // ];

//   const handleCategoryChange = async (category: string) => {
//     if (category !== selectedCategory) {
//       setSelectedCategory(category);
//       const filteredListings = await onCategoryChange(category);
//       setListings(filteredListings);
//     }
//   };

//   const handlePrev = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slidePrev();
//     }
//   };

//   const handleNext = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slideNext();
//     }
//   };

//   const handleSlideChange = (swiper: SwiperType) => {
//     setIsBeginning(swiper.isBeginning);
//     setIsEnd(swiper.isEnd);
//   };

//   return (
//     <div className="mt-10">
//       <div className="flex items-center justify-between">
//         <Heading label="Explore popular categories on Bonas" />
//         <div className="flex items-center gap-4">
//           <Link href="#" className="font-semibold underline whitespace-nowrap">
//             Show All
//           </Link>
//           <Navigation
//             onNext={handleNext}
//             onPrev={handlePrev}
//             isBeginning={isBeginning}
//             isEnd={isEnd}
//             containerStyles="hidden md:flex z-10"
//           />
//         </div>
//       </div>
//       <div className="flex gap-5">
//         <div className="w-[265px] min-w-[250px] mt-7">
//           <div className="col-span-3 flex flex-col gap-3">
//             {categories.map((category) => (
//               <CategorySelectionItem
//                 key={category.label}
//                 icon={category.icon}
//                 label={category.label}
//                 isSelected={selectedCategory === category.label}
//                 onClick={() => handleCategoryChange(category.label)}
//               />
//             ))}
//           </div>
//         </div>

//         <div className="flex-grow w-full relative mt-7">
//           <div className="absolute inset-0 -right-[2vw] lg:-right-[1.5vw] overflow-visible">
//             <CustomSwiper
//               data={listings}
//               renderItem={(listing: ExtendedListing) => (
//                 <div className="w-[230px]">
//                   <ItemCard
//                     listing={listing}
//                     slides={generateSlides(listing)}
//                   />
//                 </div>
//               )}
//               spaceBetween={3}
//               onSwiper={(swiper) => {
//                 swiperRef.current = swiper;
//                 handleSlideChange(swiper);
//               }}
//               onSlideChange={handleSlideChange}
//               hasOverlayLeft={false}
//               hasOverlayRight={true}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PremiumContent;

// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useRef, useState } from "react";
// import { Swiper as SwiperInstance } from "swiper";
// import { Swiper as SwiperType } from "swiper/types";
// import { ExtendedListing } from "../entities/ExtendedListing";
// import Heading from "./Heading";
// import ItemCard from "./ItemCard";
// import CustomSwiper from "./swiper/CustomSwiper";
// import Navigation from "./swiper/Navigation";

// interface SlideItem {
//   type: "image" | "video";
//   url: string;
// }

// interface Props {
//   lisings: ExtendedListing[];
//   generateSlides: (listing: ExtendedListing) => SlideItem[];
// }

// const PremiumContent = ({ lisings, generateSlides }: Props) => {
//   const swiperRef = useRef<SwiperInstance | null>(null);
//   const [isBeginning, setIsBeginning] = useState(true);
//   const [isEnd, setIsEnd] = useState(false);

//   const handlePrev = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slidePrev();
//     }
//   };

//   const handleNext = () => {
//     if (swiperRef.current) {
//       swiperRef.current.slideNext();
//     }
//   };

//   const handleSlideChange = (swiper: SwiperType) => {
//     setIsBeginning(swiper.isBeginning);
//     setIsEnd(swiper.isEnd);
//   };

//   return (
//     <div className="mt-10">
//       <div className="flex items-center justify-between">
//         <Heading label="Explore popular categories on Fiverr" />
//         <div className="flex items-center gap-4">
//           <Link href="#" className="font-semibold underline whitespace-nowrap">
//             Show All
//           </Link>
//           <Navigation
//             onNext={handleNext}
//             onPrev={handlePrev}
//             isBeginning={isBeginning}
//             isEnd={isEnd}
//             containerStyles="hidden md:flex z-10"
//           />
//         </div>
//       </div>
//       <div className="flex gap-5">
//         <div className="w-[265px] min-w-[250px] mt-7">
//           <div className="col-span-3 flex flex-col gap-3">
//             <p className="flex items-center gap-2 border border-gray-600 bg-gray-100 cursor-pointer p-3.5 rounded-md hover:bg-gray-100">
//               <Image
//                 alt=""
//                 src="https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg"
//                 width={24}
//                 height={24}
//               />
//               <span className="font-semibold">Electronics</span>
//             </p>
//             <p className="flex items-center gap-2 cursor-pointer p-3.5 rounded-md hover:bg-gray-100">
//               <Image
//                 alt=""
//                 src="https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg"
//                 width={23}
//                 height={23}
//               />
//               <span className="font-semibold ">Real Estate</span>
//             </p>
//             <p className="flex items-center gap-2 cursor-pointer p-3 rounded-md hover:bg-gray-100">
//               <Image
//                 alt=""
//                 src="https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg"
//                 width={24}
//                 height={24}
//               />
//               <span className="font-semibold">Job listings</span>
//             </p>
//           </div>
//         </div>

//         <div className="flex-grow w-full relative mt-7">
//           <div className="absolute inset-0 -right-[2vw] lg:-right-[1.5vw] overflow-visible">
//             <CustomSwiper
//               data={lisings}
//               renderItem={(listing: ExtendedListing) => (
//                 <div className="w-[230px]">
//                   <ItemCard
//                     listing={listing}
//                     slides={generateSlides(listing)}
//                   />
//                 </div>
//               )}
//               spaceBetween={3}
//               onSwiper={(swiper) => {
//                 swiperRef.current = swiper;
//                 handleSlideChange(swiper);
//               }}
//               onSlideChange={handleSlideChange}
//               hasOverlayLeft={false}
//               hasOverlayRight={true}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PremiumContent;
