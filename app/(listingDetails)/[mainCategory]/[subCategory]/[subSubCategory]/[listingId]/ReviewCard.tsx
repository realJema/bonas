import Image from "next/image";
import React from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import StarRating from "./StarRating";

export interface ReviewCardProps {
  name: string;
  location: string;
  createdAt: Date;
  rating: number;
  comment?: string;
}

const getTimeSincePosting = (datePosted: Date): string => {
  const postedDate = new Date(datePosted);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate.getTime() - postedDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
};

const ReviewCard = ({
  name,
  location,
  createdAt,
  comment,
}: ReviewCardProps) => {
  return (
   <div className="w-full bg-white rounded-lg p-4 sm:p-6 mb-4 border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center mb-2 sm:mb-0">
          <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-lg mr-3 flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-800 hover:underline cursor-pointer">
              {name}
            </span>
            <p className="text-xs text-gray-600">{location}</p>
          </div>
        </div>
        <div className="flex items-center mt-2 sm:mt-0">
          <StarRating rating={5} />
          <span className="text-xs text-gray-600 ml-2 whitespace-nowrap">
            | {getTimeSincePosting(createdAt)}
          </span>
        </div>
      </div>

      {comment && (
        <p className="text-gray-700 mb-4 text-sm p-2 bg-gray-50 rounded-md">
          {comment}
        </p>
      )}
      
      <div className="flex flex-wrap gap-4 items-center">
        <span className="text-sm text-gray-800 font-semibold">Helpful?</span>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-500 transition-colors duration-200">
          <ThumbsUp size={16} />
          <span className="hidden sm:inline">Yes</span>
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors duration-200">
          <ThumbsDown size={16} />
          <span className="hidden sm:inline">No</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
