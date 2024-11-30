"use client";

import React from "react";
import SkeletonListingSection from "../../skeletons/SkeletonListingSection";
import ListingSection from "../../ListingSection";
import { useCategoryListings } from "@/app/hooks/useCategoryListings";
import { generateSlides } from "@/utils/generateSlides";
import { getCategoryUrl } from "@/utils/categoryUtils";


const JobListings = () => {
  const {
    data: listings = [],
    isLoading,
    error,
  } = useCategoryListings("Jobs & Employment");

  if (isLoading) {
    return (
      <div className="mt-16 bg-[#fafafa] rounded-md">
        <SkeletonListingSection count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 bg-[#fafafa] rounded-md p-8 text-center">
        <p className="text-red-500">
          Error loading listings. Please try again later.
        </p>
      </div>
    );
  }

  // No listings found state
  if (!listings || listings.length === 0) {
    return (
      <div className="mt-16 bg-[#fafafa] rounded-md p-8 text-center">
        <p className="text-gray-500">No job listings found.</p>
      </div>
    );
  }

  return (
    <div className="mt-16 bg-[#fafafa] rounded-md">
      <ListingSection
        heading="Job Listing"
        href={getCategoryUrl("Jobs & Employment")}
        subheading="Find the perfect job opportunity for you"
        listings={listings}
        generateSlides={generateSlides}
      />
    </div>
  );
};

export default JobListings;