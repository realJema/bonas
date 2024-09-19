import Image from "next/image";
import React from "react";
import { MapPin, MessageCircle } from "lucide-react";
import PublishedCard from "./PublishedCard";

interface ImageData {
  id: number;
  listingId: number;
  imageUrl: string;
  createdAt: Date;
}

interface Props {
  image: string;
  description: string;
  rating?: number;
  username: string;
  location: string;
  datePosted: Date;
  price: string;
  listingImage: ImageData[];
  isFrench?: boolean; // New optional prop
}

const Gig = ({
  image,
  description,
  rating,
  username,
  location,
  price,
  datePosted,
  listingImage,
  isFrench = false, // Default to English
}: Props) => {
  return (
    <div className="lg:grid lg:grid-cols-3 lg:gap-6">
      <div className="lg:col-span-2">
        <div className="w-full">
          {/* Description */}
          <div className="text-lg font-bold text-black mb-4 p-2 max-w-3xl">
            {description}
          </div>

          {/* Rating */}
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

          {/* Profile info */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="relative h-32 w-32">
              <Image
                src={image}
                fill
                className="rounded-full object-cover"
                sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                alt="User profile image"
              />
            </div>
            <div className="space-y-4">
              <span className="font-medium">{username}</span>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{location} /</span>
                <MessageCircle size={16} />
                <p>{isFrench ? "parle français" : "speaks English"}</p>
                <span>121 orders completed</span>
              </div>
              <button className="bg-white text-black text-opacity-75 border border-gray-200 px-4 py-2 rounded">
                Contact me
              </button>
            </div>
          </div>

          {/* Listing images */}
          <div className="space-y-4">
            {listingImage.length > 0 && (
              <div className="h-96 md:h-[400px] relative w-full md:w-[90%]">
                <Image
                  alt={`Main listing image for listing ${listingImage[0].listingId}`}
                  src={listingImage[0].imageUrl}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {listingImage.slice(1, 7).map((img) => (
                <div key={img.id} className="aspect-square relative">
                  <Image
                    alt={`Listing image ${img.id} for listing ${img.listingId}`}
                    src={img.imageUrl}
                    fill
                    className="rounded-md object-cover"
                    sizes="(max-width: 480px) 50vw, (max-width: 768px) 33vw, 16vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* published card */}
      <div className="lg:col-span-1 mt-8 md:mt-0">
        <PublishedCard location={location} price={price} datePosted={datePosted} />
      </div>
    </div>
  );
};

export default Gig;
