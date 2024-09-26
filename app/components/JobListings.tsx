"use client";

import React, { Suspense } from "react";
import { ExtendedListing } from "../entities/ExtendedListing";
import ListingSection from "./ListingSection";
import { generateSlides } from "@/lib/generateSlides";
import SkeletonSwiper from "./swiper/SkeletonSwiper";
import SkeletonListingSection from "./skeletons/SkeletonListingSection";

interface Props {
  jobListings: Promise<ExtendedListing[]>;
}

const getCategoryUrl = (category: string) => {
  const encodedCategory = encodeURIComponent(category);
  return `/categories/${encodedCategory}`;
};

const JobListings = ({ jobListings }: Props) => {
  return (
    <div className="mt-16 bg-[#fafafa] rounded-md">
      <Suspense fallback={<SkeletonListingSection count={5} />}>
        <JobListingsContent jobListingsPromise={jobListings} />
      </Suspense>
    </div>
  );
};

const JobListingsContent = async ({
  jobListingsPromise,
}: {
  jobListingsPromise: Promise<ExtendedListing[]>;
}) => {
  const resolvedJobListings = await jobListingsPromise;

  return (
    <ListingSection
      heading="Job Listing"
      href={getCategoryUrl("jobs")}
      subheading="Find the perfect job opportunity for you"
      listings={resolvedJobListings}
      generateSlides={generateSlides}
    />
  );
};

export default JobListings;
