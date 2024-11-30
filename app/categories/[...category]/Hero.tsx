//Hero.tsx
import React from "react";
import Image from "next/image";
import { Video, Star } from "lucide-react";
import prisma from "@/prisma/client";
import { DEFAULT_COVER_IMAGE } from "@/utils/imageUtils";
import { UserAvatar } from "./UserAvatar";

export default async function Hero() {
  const listing = await prisma.listing.findFirst({
    where: {
      status: "active",
    },
    include: {
      user: {
        select: {
          name: true,
          profilImage: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  if (!listing) return null;

  return (
    <div className="mt-7 grid lg:grid-cols-2 gap-3 rounded-lg bg-gray-200 overflow-hidden">
      <div className="relative aspect-[3/2]">
        <Image
          alt="listing image"
          src={listing.cover_image || DEFAULT_COVER_IMAGE}
          fill
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative">
              <UserAvatar
                name={listing.user?.name}
                image={listing.user?.profilImage}
                size={38}
              />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-white"></span>
            </div>
            <span className="ml-2 text-sm font-semibold text-opacity-85 hover:underline cursor-pointer">
              {listing.user?.name || "Anonymous"}
            </span>
          </div>
          <span className="text-gray-700 text-xs sm:text-sm">
            {listing.created_at
              ? `${Math.floor(
                  (Date.now() - new Date(listing.created_at).getTime()) / 60000
                )} mins ago`
              : ""}
          </span>
        </div>

        <h1 className="text-xl sm:text-2xl text-black opacity-75 font-bold">
          {listing.title}
        </h1>

        <div className="font-bold flex items-center gap-2">
          <Star className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" />
          {listing.rating || "4.9"}{" "}
          <span className="opacity-80 text-sm">(1k+)</span>
        </div>

        <p className="font-semibold">From ${listing.price}</p>

        <p className="font-medium text-xs sm:text-sm">
          <Video className="w-4 h-4 sm:w-5 sm:h-5 inline-block mr-1" />
          Offers video consultations
        </p>
      </div>
    </div>
  );
}
