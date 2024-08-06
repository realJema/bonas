'use client'

import React, { useRef, useState } from "react";
import VehiculesAndMotorType from "../entities/VehiculesAndMotor";
import TopRatedBadge from "./badges/TopRatedBadge";
import ProBadge from "./badges/Probadge";
import LevelBadge from "./badges/Levelbadge";
import ItemCard from "./ItemCard";
import CustomSwiper from "./swiper/CustomSwiper";
import Heading from "./Heading";
import Navigation from "./swiper/Navigation";
import SubHeading from "./SubHeading";
import { Swiper as SwiperType } from "swiper/types";

const categories: VehiculesAndMotorType[] = [
  {
    title: "I will do custom unique minimalist modern brand logo design",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/120741108/original/99d9b422c907873158a3a1b88bd40f1aa3f791ed.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs2/120741108/original/5ee091d63f9977182138e2836125a7a1986f47b1.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs3/120741108/original/b3a3590f1f95ae2f36c50afafeb74213f5087d1b.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/image/upload/t_gig_cards_web,q_auto,f_auto/v1/attachments/delivery/asset/59be05ed603a6c79b6cce7baa54ec850-1720943857/2.jpg",
      },
    ],
    name: "Radovan D",
    price: 35,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/d1fb81c681993c796b9c21408e778fb5-1648209686236/22ac4702-0243-4cf4-8c31-ea0d233d1907.jpg",
    rating: 4.9,
    Badge: LevelBadge,
    offersVideo: false,
  },
  {
    title: "I will create timeless business and modern minimalist logo",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/67151721/original/b50ccf31d5f8d266fd9cfbb32dc956022ed31d05.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs2/67151721/original/b086852379519088cca393f5e9c8faf168241989.jpg",
      },
    ],
    name: "Zonestudio",
    price: 45,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/2f7f1d428d0570ab44654f8c96c1f723-1576853089439/be17994b-204a-4be8-a280-34807e880ca2.jpg",
    rating: 4.9,
    Badge: TopRatedBadge,
    offersVideo: false,
  },
  {
    title: "I will do vintage , retro , classic , hipster badge , outdoor or",
    slides: [
      {
        type: "video",
        url: "https://fiverr-res.cloudinary.com/video/upload/t_fiverr_hd/v1/video-attachments/delivery/asset/5a63e0dcab8d5eba414b63c3bf1cce53-1716903649/Stacklist-Square",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs3/152144644/original/9c4054b207ee7bf295f4a6376b4b7603bfadd71f.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/8020116/original/6ecd0c33db92111176205c6e877487710a84dc01.jpg",
      },
    ],
    name: "Louis Key.",
    price: 130,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/fb8d0d0cc23a0f595cc0a0391eb62486-1718812732445/6bb1cec0-9789-4d7d-a22c-031cfe35f0d9.jpg",
    rating: 4.8,
    Badge: ProBadge,
    offersVideo: true,
  },
  {
    title: "I will create a minimalist logo design for your business",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/922925/original/bbe1ae05d480bba8aaaab21e8dfccf624d52fc43.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs2/922925/original/cffb5437091cd2a89c231cef1c6c0d236e4d510c.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs3/922925/original/f85099662a4ed8c45fdb6031f66743dcb42ba39e.jpg",
      },
    ],
    name: "Logosking.",
    price: 20,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/448b8d4acc9ffa9d53ce4aa5dfe3e441-1624855649070/67395eed-7c25-494e-8c3d-7baf23082b63.jpg",
    rating: 4.9,
    Badge: TopRatedBadge,
    offersVideo: false,
  },
  {
    title: "I will create a minimalist logo design for your business",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/115533372/original/36a26451dd7876335f8f646d41edf6868bea0a93.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs2/922925/original/cffb5437091cd2a89c231cef1c6c0d236e4d510c.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs3/922925/original/f85099662a4ed8c45fdb6031f66743dcb42ba39e.jpg",
      },
    ],
    name: "Alpha",
    price: 20,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/448b8d4acc9ffa9d53ce4aa5dfe3e441-1624855649070/67395eed-7c25-494e-8c3d-7baf23082b63.jpg",
    rating: 4.9,
    Badge: ProBadge,
    offersVideo: false,
  },
  {
    title: "I will make brilliant designs to suit your need",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/98379278/original/bb6c9442816232f4839bfa3e0976cab6b2a1e878.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/98379278/original/bb6c9442816232f4839bfa3e0976cab6b2a1e878.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/98379278/original/bb6c9442816232f4839bfa3e0976cab6b2a1e878.jpg",
      },
    ],
    name: "Prachi R.",
    price: 30,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/94e66a82b6f88eeac72fcce36a7fc8ad-1549031292382/0cedf496-b54d-4763-a665-5fde15e3c7e6.jpg",
    rating: 4.9,
    Badge: TopRatedBadge,
    offersVideo: false,
  },
  {
    title: "I will design creative logo with all files in 72h",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs/2625783/original/74b805306d145c306662ce5e2581284755b22781.png",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/image/upload/t_gig_cards_web,q_auto,f_auto/v1/attachments/delivery/asset/8d17ec324a78b1172b24d712ae70052c-1718878237/Yunicu-Update.png",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/image/upload/t_gig_cards_web,q_auto,f_auto/v1/attachments/delivery/asset/022229dec64267b83e2304d907bbf834-1717760445/Judo-Grid-1.png",
      },
    ],
    name: "Bojan Sandic",
    price: 120,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/e52f2ae2e43bcb04886706346023c3dd-1524052716848/142fb2c5-2321-4fdb-9496-861e753d6e5a.jpg",
    rating: 4.9,
    Badge: ProBadge,
    offersVideo: true,
  },
  {
    title: "I will create a minimalist logo design for your business",
    slides: [
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/image/upload/t_gig_cards_web,q_auto,f_auto/v1/attachments/delivery/asset/022229dec64267b83e2304d907bbf834-1717760445/Judo-Grid-1.png",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs2/922925/original/cffb5437091cd2a89c231cef1c6c0d236e4d510c.jpg",
      },
      {
        type: "image",
        url: "https://fiverr-res.cloudinary.com/t_gig_cards_web,q_auto,f_auto/gigs3/922925/original/f85099662a4ed8c45fdb6031f66743dcb42ba39e.jpg",
      },
    ],
    name: "Alpha",
    price: 20,
    profileImgUrl:
      "https://fiverr-res.cloudinary.com/t_profile_thumb,q_auto,f_auto/attachments/profile/photo/448b8d4acc9ffa9d53ce4aa5dfe3e441-1624855649070/67395eed-7c25-494e-8c3d-7baf23082b63.jpg",
    rating: 4.9,
    Badge: ProBadge,
    offersVideo: false,
  },
];

const VehiculesAndMotor = () => {
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
    <div className="mt-52">
      <div className="flex items-center justify-between">
        <Heading label="Vehicules and Motor" />
        <Navigation
          onPrev={handlePrev}
          onNext={handleNext}
          isBeginning={isBeginning}
          isEnd={isEnd}
        />
      </div>

      <SubHeading label="Hand-vetted talent for all your professional needs" />

      <CustomSwiper
        data={categories}
        renderItem={(item) => (
          <div className="w-[230px]">
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
        spaceBetween={2}
        slidesPerView="auto"
        className="vehicules-motor-swiper"
        slideClassName="pr-4"
        hasOverlayRight={true}
        swiperProps={{
          freeMode: true,
          grabCursor: true,
          mousewheel: true,
          keyboard: true,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          handleSlideChange(swiper);
        }}
        onSlideChange={handleSlideChange}
      />
    </div>
  );
};

export default VehiculesAndMotor;

