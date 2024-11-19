import React from "react";
import ItemCardSkeleton from "@/app/components/skeletons/ItemCardSkeleton";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UsersProfileSkeleton = () => {
  return (
    <div className="pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content area - takes up 2/3 on desktop */}
        <div className="lg:col-span-2 space-y-6">
          {/* UserProfile skeleton */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Skeleton circle width={100} height={100} />
              <div className="space-y-2">
                <Skeleton width={200} />
                <Skeleton width={150} />
              </div>
            </div>
            {/* Skills skeleton */}
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((_, index) => (
                <Skeleton key={index} width={100} height={24} />
              ))}
            </div>
            {/* Bio skeleton */}
            <div className="space-y-2">
              <Skeleton count={3} />
            </div>
          </div>
        </div>

        {/* Sidebar area - takes up 1/3 on desktop */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            {/* ProfileCard skeleton */}
            <div className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center space-x-3">
                <Skeleton circle width={60} height={60} />
                <div className="space-y-2">
                  <Skeleton width={120} />
                  <Skeleton width={100} />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton width={200} />
                <Skeleton width={180} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Listings skeleton */}
      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4 px-4 sm:px-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      </div>

      {/* Reviews skeleton */}
      <div className="flex-col space-y-4 mt-6 w-full max-w-3xl mx-auto sm:mx-0 px-3 sm:px-0">
        {/* Reviews header skeleton */}
        <div className="space-y-2">
          <Skeleton width={150} height={24} />
          <Skeleton width={300} />
        </div>

        {/* Search reviews skeleton */}
        <div className="w-full sm:max-w-2xl">
          <Skeleton height={40} />

          {/* Sort reviews skeleton */}
          <div className="my-6">
            <Skeleton width={120} height={32} />
          </div>

          {/* Review cards skeleton */}
          <div className="space-y-4">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton circle width={40} height={40} />
                  <div className="space-y-1">
                    <Skeleton width={120} />
                    <Skeleton width={100} />
                  </div>
                </div>
                <Skeleton count={2} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersProfileSkeleton;
