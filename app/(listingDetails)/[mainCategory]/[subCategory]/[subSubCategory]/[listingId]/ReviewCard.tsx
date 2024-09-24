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
    <div className="max-w-xl w-full bg-white rounded-lg p-6 mb-4 border-b">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center mb-2 sm:mb-0">
          <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-lg mr-3">
            {name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-sm font-semibold text-gray-800 hover:underline cursor-pointer">
              {name}
            </span>
            <p className="text-xs text-gray-600">{location}</p>
          </div>
        </div>
      </div>

      {/* review date created */}
      <div className="flex items-center mb-2.5">
        <StarRating rating={5} />
        <span className="text-xs text-gray-600 ml-2">
          | {getTimeSincePosting(createdAt)}
        </span>
      </div>

      {/* review comment */}
      <p className="text-gray-700 mb-4 text-sm p-2">{comment}</p>
      <div className="flex gap-4">
        <span className="text-sm text-gray-800 font-semibold">Helpful?</span>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-500">
          <ThumbsUp size={16} />
          Yes
        </button>
        <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500">
          <ThumbsDown size={16} />
          No
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
