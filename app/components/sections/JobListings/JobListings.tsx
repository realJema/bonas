"use client";

import React, { Suspense } from "react";
import { generateSlides } from "@/lib/generateSlides";
import SkeletonListingSection from "../../skeletons/SkeletonListingSection";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import ListingSection from "../../ListingSection";


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
