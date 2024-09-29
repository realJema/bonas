"use client";

import {
  HeartIcon,
  VideoCameraIcon,
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { ComponentType, useRef, useState } from "react";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import dynamic from "next/dynamic";
import type { ReactPlayerProps } from "react-player/types";
import { Listing, Category, User } from "@prisma/client";
import { ExtendedListing } from "../entities/ExtendedListing";
import { formatPrice, formatDatePosted } from "@/utils/formatUtils";
import { buildListingUrl } from "@/utils/categoryUtils";
const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

// Define SlideItem type
export interface SlideItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
}

// Define props for ItemCard
interface Item {
  listing: ExtendedListing;
  slides: SlideItem[];
  Badge?: ComponentType;
  offersVideo?: boolean;
  width?: string;
}

const ItemCard = ({
  listing,
  slides,
  Badge,
  offersVideo,
  width = "240px",
}: Item) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<ReactPlayerProps>(null);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleMute = () => {
    setIsMuted(!isMuted);
  };

  const renderSlide = (item: SlideItem, index: number) => {
    if (item.type === "image") {
      return (
        <Slide index={index} key={index}>
          <div className="h-40 w-full relative cursor-pointer">
            <Image
              alt={`${listing.title} - image ${index + 1}`}
              src={item.url}
              fill
              className="rounded-md object-cover"
              sizes="240px"
            />
            <div className="absolute top-2 right-2">
              <HeartIcon className="h-7 w-7 text-white fill-gray-800" />
            </div>
          </div>
        </Slide>
      );
    } else {
      return (
        <Slide index={index} key={index}>
          <div className="h-40 w-full relative cursor-pointer">
            <ReactPlayer
              ref={playerRef}
              url={item.url}
              width="100%"
              height="100%"
              playing={isPlaying}
              muted={isMuted}
              loop={true}
              playsinline={true}
              onReady={() => setIsPlaying(true)}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload",
                  },
                },
              }}
            />
            <div className="absolute top-2 right-2">
              <HeartIcon className="h-7 w-7 text-white fill-gray-800" />
            </div>
            <div className="absolute w-full bottom-2 left-2 flex items-center justify-between ps-6 py-2 pe-8">
              <button
                onClick={handlePlayPause}
                className="bg-black bg-opacity-90 rounded-full p-1.5"
              >
                {isPlaying ? (
                  <PauseIcon className="h-4 w-4 text-white" />
                ) : (
                  <PlayIcon className="h-4 w-4 text-white" />
                )}
              </button>
              <button
                onClick={handleMute}
                className="bg-black bg-opacity-90 rounded-full p-1.5"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-4 w-4 text-white" />
                ) : (
                  <SpeakerWaveIcon className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </div>
        </Slide>
      );
    }
  };

  return (
    <div
      className={`${width} rounded-md z-30 ${isHovered ? "" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CarouselProvider
        naturalSlideWidth={240}
        naturalSlideHeight={192}
        totalSlides={slides.length}
        isIntrinsicHeight={true}
        currentSlide={currentSlide}
        className="carousel-slider"
      >
        <div className="relative">
          <Slider className="rounded-md overflow-hidden border border-gray-200">
            {slides.map((slide, index) => renderSlide(slide, index))}
          </Slider>
          {isHovered && slides.length > 1 && (
            <>
              {currentSlide > 0 && (
                <ButtonBack
                  className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-50 rounded-full h-8 w-8 flex items-center justify-center shadow-md z-20 transition-opacity duration-200 hover:bg-gray-100"
                  onClick={() =>
                    setCurrentSlide((prev) => Math.max(0, prev - 1))
                  }
                >
                  <svg
                    width="8"
                    height="15"
                    viewBox="0 0 8 15"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-600"
                  >
                    <path
                      d="M7.2279 0.690653L7.84662 1.30934C7.99306 1.45578 7.99306 1.69322 7.84662 1.83968L2.19978 7.5L7.84662 13.1603C7.99306 13.3067 7.99306 13.5442 7.84662 13.6907L7.2279 14.3094C7.08147 14.4558 6.84403 14.4558 6.69756 14.3094L0.153374 7.76518C0.00693607 7.61875 0.00693607 7.38131 0.153374 7.23484L6.69756 0.690653C6.84403 0.544184 7.08147 0.544184 7.2279 0.690653Z"
                      fill="currentColor"
                    />
                  </svg>
                </ButtonBack>
              )}
              {currentSlide < slides.length - 1 && (
                <ButtonNext
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-50 rounded-full h-8 w-8 flex items-center justify-center shadow-sm z-20 transition-opacity duration-200 hover:bg-gray-100"
                  onClick={() =>
                    setCurrentSlide((prev) =>
                      Math.min(slides.length - 1, prev + 1)
                    )
                  }
                >
                  <svg
                    width="8"
                    height="15"
                    viewBox="0 0 8 15"
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 text-gray-600"
                  >
                    <path
                      d="M0.772102 14.3093L0.153379 13.6906C0.00694026 13.5442 0.00694026 13.3067 0.153379 13.1603L5.80022 7.5L0.153379 1.83967C0.00694026 1.69323 0.00694026 1.45577 0.153379 1.30931L0.772102 0.690585C0.918534 0.544151 1.15598 0.544151 1.30242 0.690585L7.84661 7.23482C7.99307 7.38125 7.99307 7.61869 7.84661 7.76516L1.30242 14.3093C1.15598 14.4558 0.918534 14.4558 0.772102 14.3093Z"
                      fill="currentColor"
                    />
                  </svg>
                </ButtonNext>
              )}
            </>
          )}
        </div>
      </CarouselProvider>
      <Link href={buildListingUrl(listing)}>
        <div className="flex flex-col gap-1 mt-1 p-1 hover:bg-gray-200 h-40 rounded-sm">
          <div className="flex items-center justify-between">
            <div className="flex gap-1 items-center">
              <Image
                alt={listing.user.username!}
                src={listing.user.profilePicture!}
                width={27}
                height={27}
                className="object-cover rounded-full"
              />
              <span className="text-sm font-semibold text-opacity-85 hover:underline cursor-pointer">
                {listing.user.name}
              </span>
            </div>
            {/* date posted */}
            <span className="text-sm text-gray-600">
              {formatDatePosted(listing.createdAt)}
            </span>
          </div>
          <h1 className="hover:underline px-1.5 py-0.5">
            {listing?.title}
          </h1>
          <div className="font-bold flex items-center gap-2 px-1 py-0.5">
            <svg
              className="flex-shrink-0 w-5 h-5 inline-block"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
            </svg>
            {} <span className="opacity-80">(1k+)</span>
          </div>
          <p className="font-semibold px-1 py-0.5 mb-3">
            <span className="font-normal">from</span>{" "}
            {formatPrice(listing.price)}
          </p>
          {offersVideo && (
            <p className="font-medium text-sm">
              <VideoCameraIcon className="w-5 h-5 inline-block mr-1" />
              Offers video consultations
            </p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ItemCard;
