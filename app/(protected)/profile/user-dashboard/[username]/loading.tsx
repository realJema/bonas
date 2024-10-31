import React from "react";
import { MapPin, User } from "lucide-react";
import ItemCardSkeleton from "@/app/components/skeletons/ItemCardSkeleton";

const ProfileCardSkeleton = () => {
  return (
    <div className="bg-white px-6 py-8 rounded-lg shadow-sm relative">
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
      </div>
      <div className="text-center mb-4">
        <div className="h-8 w-48 bg-gray-200 mx-auto rounded animate-pulse mb-2" />
        <div className="h-4 w-32 bg-gray-200 mx-auto rounded animate-pulse" />
      </div>
      <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse mb-4" />
      <hr className="border-gray-200 mb-4" />
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            From
          </span>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center text-gray-600">
            <User className="w-4 h-4 mr-2" />
            Member since
          </span>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
};

const LearnMoreCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="h-16 bg-gray-200 rounded animate-pulse" />
      <div className="h-10 bg-gray-200 rounded animate-pulse" />
    </div>
  );
};

const DescriptionCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      <div className="h-24 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-2">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
};

const UserProfilePageSkeleton = () => {
  return (
    <>
      <div className="h-16 bg-white shadow-sm" /> {/* Header placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-4 container mx-auto px-4 pt-6 md:max-w-7xl">
        <div className="lg:col-span-1 space-y-6 p-2 md:py-5 mt-6">
          <ProfileCardSkeleton />
          <LearnMoreCardSkeleton />
          <DescriptionCardSkeleton />
        </div>
        <div className="lg:col-span-3">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mx-4 mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 px-4 sm:px-4">
            {[...Array(6)].map((_, index) => (
              <ItemCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePageSkeleton;
