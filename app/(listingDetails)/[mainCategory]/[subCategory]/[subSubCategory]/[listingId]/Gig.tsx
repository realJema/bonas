"use client";

import Image from "next/image";
import React, { useState } from "react";
import Link from "next/link";
import CategoryButton from "./CategoryButton";
import Reviews from "../../../../../components/Reviews";
import SearchReviews from "../../../../../components/SearchReviews";
import ReviewCard, {
  ReviewCardItems,
} from "../../../../../components/cards/ReviewCard/ReviewCard";
import InfoRow from "./InfoRow";
import PublishedCard from "./PublishedCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import DescriptionFormatter from "@/app/components/DescriptionFormatter";
import ImageGallery from "./ImageGallery";
import { ReviewSection } from "@/app/components/reviews/ReviewSection/ReviewSection";
import { Review } from "@/app/types/review";

interface Props {
  title: string;
  image: string;
  coverImage?: string;
  description: string;
  rating?: string | null;
  username: string;
  userPhoneNumber: string | null;
  userEmail: string | null;
  location: string;
  datePosted: Date;
  price: string;
  listingImages: string[];
  listingId: string;
  categoryName: string;
  condition?: string | null;
  currency?: string | null;
  tags?: string[];
  userId?: string | null;
  deliveryAvailable?: string;
  negotiable?: string;
  deadline: Date | null;
  initialReviews: Review[] | undefined;
  totalReviews?: number;
}


const Gig = ({
  title,
  image,
  description,
  rating,
  username,
  userEmail,
  userPhoneNumber,
  location,
  price,
  datePosted,
  listingImages,
  listingId,
  categoryName,
  condition,
  currency,
  tags = [],
  coverImage,
  deliveryAvailable,
  negotiable,
  deadline,
  initialReviews = [],
  totalReviews = 0,
}: Props) => {
  const [selectedImage, setSelectedImage] = useState(
    coverImage || listingImages[0]
  );

  // console.log('condition: ',condition)
  // console.log('condition: ',condition)

  return (
    <div>
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="w-full">
            {rating && (
              <div className="flex items-center mb-4">
                <svg
                  width="16"
                  height="15"
                  viewBox="0 0 16 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M15.4399 6.18829C15.4399 6.34779 15.3228 6.49843 15.2056 6.61362L11.9333 9.75044L12.7085 14.181C12.7176 14.243 12.7176 14.2961 12.7176 14.3582C12.7176 14.5886 12.6094 14.8012 12.348 14.8012C12.2218 14.8012 12.0956 14.7569 11.9874 14.6949L7.93994 12.6037L3.89246 14.6949C3.77528 14.7569 3.65809 14.8012 3.53189 14.8012C3.27047 14.8012 3.15328 14.5886 3.15328 14.3582C3.15328 14.2961 3.1623 14.243 3.17131 14.181L3.94655 9.75044L0.665302 6.61362C0.557129 6.49843 0.439941 6.34779 0.439941 6.18829C0.439941 5.92246 0.719389 5.81613 0.94475 5.78068L5.46999 5.13382L7.49824 1.10204C7.57937 0.933682 7.73261 0.738739 7.93994 0.738739C8.14727 0.738739 8.30052 0.933682 8.38164 1.10204L10.4099 5.13382L14.9351 5.78068C15.1515 5.81613 15.4399 5.92246 15.4399 6.18829Z"
                    fill="#404145"
                  />
                </svg>
                <span className="text-black font-medium">{rating}</span>
                <span className="text-black opacity-75 ml-1">(8)</span>
              </div>
            )}
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative h-24 w-24">
                <Image
                  src={image}
                  fill
                  className="rounded-full object-cover"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                  alt={`${username}'s profile`}
                />
              </div>
              <InfoRow location={location} username={username} />
            </div>
            <div className="text-lg md:text-xl font-bold text-black mb-4 p-2 max-w-3xl">
              {title}
            </div>
            <ImageGallery
              listingImages={listingImages}
              coverImage={coverImage}
            />
          </div>

          <div className="lg:hidden mt-8 w-full sm:max-w-3xl">
            <PublishedCard
              location={location}
              price={price}
              deadline={deadline}
              currency={currency}
              datePosted={datePosted}
              userEmail={userEmail}
              userPhoneNumber={userPhoneNumber}
              condition={condition}
              deliveryAvailable={deliveryAvailable}
              negotiable={negotiable}
            />
          </div>

          <div className="flex-col gap-3 w-full max-w-xl mt-6">
            <h2 className="font-bold mb-1">Description</h2>
            <div className="text-gray-500 mb-5">
              <DescriptionFormatter content={description} maxLength={300} />
            </div>

            {condition && (
              <div className="mt-5">
                <h3 className="font-semibold mb-2">Condition</h3>
                <p className="text-gray-700">{condition}</p>
              </div>
            )}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {tags.map((tag, index) => (
                  <CategoryButton key={index} label={tag} />
                ))}
              </div>
            )}

            <ReviewSection
              initialReviews={initialReviews}
              totalReviews={totalReviews}
              listingId={BigInt(listingId)}
            />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <PublishedCard
            location={location}
            price={price}
            deadline={deadline}
            currency={currency}
            datePosted={datePosted}
            userEmail={userEmail}
            userPhoneNumber={userPhoneNumber}
            condition={condition}
            deliveryAvailable={deliveryAvailable}
            negotiable={negotiable}
          />
        </div>
      </div>
    </div>
  );
};

export default Gig;
