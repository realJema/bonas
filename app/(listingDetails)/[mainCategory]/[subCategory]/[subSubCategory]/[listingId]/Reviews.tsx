import React from "react";
import { Star, StarHalf } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import StarRating from "./StarRating";

const Reviews = () => {
  return (
    <div className="w-full max-w-xl mt-5">
      <h1 className="text-xl font-bold text-black/65">Reviews</h1>

      <div className="flex flex-col gap-3">
        <p className="flex items-center space-x-2 justify-between">
          <span className="text-sm md:text-base">8 reviews for this Gig</span>
          <div className="flex items-center">
            <StarRating rating={5} />
            <span className="text-sm md:text-base">5</span>
          </div>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 mt-4 md:mt-3">
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center space-x-2">
                <span
                  className={`font-bold w-16 ${
                    stars < 5 ? "text-gray-400" : "text-black"
                  }`}
                >
                  {stars} Stars
                </span>
                <Progress
                  value={stars === 5 ? 100 : 0}
                  className={`w-32 ${stars < 5 ? "bg-gray-200" : ""}`}
                />
                <span className={stars < 5 ? "text-gray-400" : "text-black"}>
                  ({stars === 5 ? 8 : 0})
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">Rating Breakdown</h3>
            {[
              { label: "Seller communication level", rating: 4.9 },
              { label: "Recommended to a friend", rating: 5 },
              { label: "Service as described", rating: 5 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <p className="text-black/55 text-sm">{item.label}</p>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-black fill-current" />
                  <span>{item.rating}</span>
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
