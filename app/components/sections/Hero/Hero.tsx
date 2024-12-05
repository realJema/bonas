"use client";

import { formatUsername } from "@/utils/formatUtils";
import { useCallback, useState } from "react";
import { Swiper as SwiperType } from "swiper";
import HeroLink, { HeroLinkProps } from "../../HeroLink";
import HeroSwiper from "../../swiper/HeroSwipper";
import Navigation from "../../swiper/Navigation";
import Image from "next/image";
import backgroundImage from "@/public/Banner-Desktop.webp";

const heroLinksData: HeroLinkProps[] = [
  {
    href: "#",
    title: "Get Matched with freelancers",
    description: "create a brief and get custom offers.",
    imageSrc:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/4058b3b3a6b0b3ac15f040c92bd2b05f-1704098481407/brief-and-match-icon.png",
    imageAlt: "Freelancer matching icon",
    message: "recommended for you",
    badge: false,
  },
  {
    href: "#",
    title: "Reply to Abhi patal",
    description: "Hi",
    imageSrc:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80",
    imageAlt: "Tailor Fiverr icon",
    message: "new message",
    badge: true,
  },
  {
    href: "#",
    title: "Tailor Fiverr to your needs",
    description: "Tell us about your needs",
    imageSrc:
      "https://fiverr-res.cloudinary.com/image/upload/f_auto,q_auto/v1/attachments/generic_asset/asset/093afbd0303654d5957e5ce787f7bd1f-1704031598839/Frame%201000001535.png",
    imageAlt: "Tailor Fiverr icon",
    message: "business recommendations",
    badge: false,
  },
];

interface Props {
  username?: string;
}

const Hero = ({ username }: Props) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleSwiper = useCallback((swiperInstance: SwiperType) => {
    setSwiper(swiperInstance);
    setIsBeginning(swiperInstance.isBeginning);
    setIsEnd(swiperInstance.isEnd);
  }, []);

  const handlePrev = useCallback(() => {
    swiper?.slidePrev();
    setIsBeginning(swiper?.isBeginning ?? true);
    setIsEnd(swiper?.isEnd ?? false);
  }, [swiper]);

  const handleNext = useCallback(() => {
    swiper?.slideNext();
    setIsBeginning(swiper?.isBeginning ?? true);
    setIsEnd(swiper?.isEnd ?? false);
  }, [swiper]);

  return (
    <section className="hero mt-16 md:mt-24 xl:mt-16 h-full py-10 rounded-2xl text-white relative">
      <Image
        alt="Hero background"
        src={backgroundImage}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
          zIndex: -1,
          borderRadius: "1rem",
        }}
      />
      <div className="relative z-10">
        <h1 className="text-white text-2xl md:text-[34px] font-semibold mb-8 px-8">
          Welcome to Obilli{" "}
          {username && <span>, {formatUsername(username)} 🎉</span>}
        </h1>

        <div className="hidden xl:flex items-center gap-4 w-full px-8">
          {heroLinksData.map((linkData, index) => (
            <HeroLink
              className="bg-green-50 bg-opacity-20"
              key={index}
              {...linkData}
            />
          ))}
        </div>
        <div className="xl:hidden px-4 md:px-8">
          <div className="flex justify-end mb-2.5">
            <Navigation
              bg="gray-100"
              onNext={handleNext}
              onPrev={handlePrev}
              isBeginning={isBeginning}
              isEnd={isEnd}
            />
          </div>
          <HeroSwiper onSwiper={handleSwiper} slides={heroLinksData} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
