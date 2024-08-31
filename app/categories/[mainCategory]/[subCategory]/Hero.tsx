import React from "react";
import Image from "next/image";
import categoryHero from "@/public/category-hero.png";
import { VideoCameraIcon } from "@heroicons/react/24/outline";
import profileImage from "@/public/category-hero.png";

const Hero = () => {
  return (
    <div className="mt-7 grid lg:grid-cols-2 gap-3 rounded-lg bg-gray-200 overflow-hidden">
      <div className="relative aspect-[3/2]">
        <Image
          alt="category hero image"
          src={categoryHero}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative rounded-full">
              <Image
                alt={"name"}
                src={profileImage}
                width={38}
                height={38}
                className="object-cover rounded-full"
              />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
            </div>
            {/* name */}
            <span className="ml-2 text-sm font-semibold text-opacity-85 hover:underline cursor-pointer">
              San jo
            </span>
          </div>

          {/* time posted */}
          <span className="text-gray-700 text-xs sm:text-sm">18 mins ago</span>
        </div>

        {/* title */}
        <h1 className="text-xl sm:text-2xl text-black opacity-75 font-bold">
          I will do creative minimalist business logo design
        </h1>

        <div className="font-bold flex items-center gap-2">
          <svg
            className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 inline-block"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
          >
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"></path>
          </svg>
          4.9 <span className="opacity-80 text-sm">(1k+)</span>
        </div>

        <p className="font-semibold">From $24</p>

        <p className="font-medium text-xs sm:text-sm">
          <VideoCameraIcon className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1" />
          Offers video consultations
        </p>
      </div>
    </div>
  );
};

export default Hero;
