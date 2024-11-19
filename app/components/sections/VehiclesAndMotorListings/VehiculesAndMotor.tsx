"use client";

import React from "react";
import SkeletonListingSection from "../../skeletons/SkeletonListingSection";
import ListingSection from "../../ListingSection";
import { useCategoryListings } from "@/app/hooks/useCategoryListings";
import { generateSlides } from "@/utils/generateSlides";

const getCategoryUrl = (category: string) => {
  const encodedCategory = encodeURIComponent(category);
  return `/categories/${encodedCategory}`;
};

const VehiclesAndMotor = () => {
  const {
    data: listings = [],
    isLoading,
    error,
  } = useCategoryListings("Vehicles & Transport");

  if (isLoading) {
    return (
      <div className="mt-52 bg-[#fafafa] rounded-md">
        <SkeletonListingSection count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-52 bg-[#fafafa] rounded-md p-8 text-center">
        <p className="text-red-500">
          Error loading listings. Please try again later.
        </p>
      </div>
    );
  }

  // No listings found state
  if (!listings || listings.length === 0) {
    return (
      <div className="mt-52 bg-[#fafafa] rounded-md p-8 text-center">
        <p className="text-gray-500">No vehicle listings found.</p>
      </div>
    );
  }

  return (
    <div className="mt-52 bg-[#fafafa] rounded-md">
      <ListingSection
        heading="Vehicles and Motor"
        href={getCategoryUrl("vehicles")}
        subheading="Hand-vetted talent for all your professional needs"
        listings={listings}
        generateSlides={generateSlides}
      />
    </div>
  );
};

export default VehiclesAndMotor;
