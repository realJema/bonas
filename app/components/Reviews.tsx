import React from "react";
import { Star, StarHalf } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StarRating from "../(listingDetails)/[mainCategory]/[subCategory]/[subSubCategory]/[listingId]/StarRating";

interface Props {
  className?: string;
}

const Reviews = ({className}:Props) => {
  return (
    <div className={`${className}`}>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h1>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <p className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">
            8 reviews for this Gig
          </p>
          <div className="flex items-center">
            <StarRating rating={5} />
            <span className="ml-2 text-xl font-bold text-gray-900">5.0</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-4">
                <span
                  className={`font-medium text-sm w-16 ${
                    stars < 5 ? "text-gray-400" : "text-gray-900"
                  }`}
                >
                  {stars} Stars
                </span>
                <Progress
                  value={stars === 5 ? 100 : 0}
                  className={`flex-grow h-2 ${stars < 5 ? "bg-gray-200" : ""}`}
                />
                <span
                  className={`text-sm ${
                    stars < 5 ? "text-gray-300" : "text-gray-900"
                  }`}
                >
                  ({stars === 5 ? 8 : 0})
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900 mb-3">
              Rating Breakdown
            </h3>
            {[
              { label: "Seller communication level", rating: 4.9 },
              { label: "Recommended to a friend", rating: 5 },
              { label: "Service as described", rating: 5 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-gray-700 text-sm">{item.label}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-gray-950 fill-current" />
                  <span className="font-medium text-gray-900">
                    {item.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
