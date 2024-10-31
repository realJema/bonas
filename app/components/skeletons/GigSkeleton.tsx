import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Check, Clock, MapPin, MessageCircle } from "lucide-react";

const GigSkeleton = () => {
  return (
    <div>
      <div className="lg:grid lg:grid-cols-3 lg:gap-6">
        <div className="lg:col-span-2">
          <div className="w-full">
            {/* Title Skeleton */}
            <div className="text-lg font-bold text-black mb-4 p-2 max-w-3xl">
              <Skeleton height={24} />
            </div>

            {/* Rating Skeleton */}
            <div className="flex items-center mb-4 gap-2">
              <Skeleton width={20} height={20} />
              <Skeleton width={40} />
            </div>

            {/* Profile info Skeleton */}
            <div className="flex items-center space-x-4 mb-4">
              <Skeleton circle width={96} height={96} />
              <div className="space-y-4 flex-1">
                <Skeleton width={120} height={20} />
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-gray-300" />
                    <Skeleton width={100} />
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} className="text-gray-300" />
                    <Skeleton width={80} />
                  </div>
                  <Skeleton width={120} />
                </div>
                <Skeleton width={100} height={36} />
              </div>
            </div>

            {/* Listing images Skeleton */}
            <div className="space-y-4">
              <div className="h-96 md:h-[400px] w-full md:w-[90%]">
                <Skeleton height="100%" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="aspect-square">
                    <Skeleton height="100%" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PublishedCard Skeleton for mobile to lg screens */}
          <div className="lg:hidden mt-8 w-full sm:max-w-3xl">
            <PublishedCardSkeleton />
          </div>

          <div className="flex-col gap-3 w-full max-w-xl mt-6">
            {/* Description Skeleton */}
            <Skeleton height={24} className="mb-1" />
            <div className="space-y-2 mb-5">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} height={16} />
              ))}
            </div>

            {/* Categories Skeleton */}
            <div className="flex flex-wrap gap-3 mt-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} width={80} height={32} />
              ))}
            </div>

            {/* Reviews Skeleton */}
            <div className="flex-col space-y-4 mt-6">
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <ReviewCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* PublishedCard Skeleton for lg screens and above */}
        <div className="hidden lg:block lg:col-span-1">
          <PublishedCardSkeleton />
        </div>
      </div>
    </div>
  );
};

const PublishedCardSkeleton = () => {
  return (
    <div className="p-6 md:sticky md:top-[50px] bg-white shadow-md rounded-lg border border-gray-200">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <Skeleton width={150} height={20} />
          <Skeleton width={100} height={20} />
        </div>

        <Skeleton height={40} />

        <div className="flex items-center space-x-2">
          <Clock size={16} className="text-gray-300" />
          <Skeleton width={100} />
        </div>

        <div className="space-y-2">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Check size={16} className="text-gray-300" />
              <Skeleton width={120} />
            </div>
          ))}
        </div>

        <Skeleton height={48} />

        <div className="mt-12 bg-gray-200 p-4 rounded-md">
          <Skeleton height={40} />
        </div>
      </div>
    </div>
  );
};

const ReviewCardSkeleton = () => {
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center space-x-3 mb-3">
        <Skeleton circle width={40} height={40} />
        <div className="flex-1">
          <Skeleton width={120} height={20} />
          <div className="flex items-center gap-2">
            <Skeleton width={80} />
            <Skeleton width={100} />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton count={3} />
      </div>
    </div>
  );
};

export default GigSkeleton;
