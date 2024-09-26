"use client";

import React, { Suspense } from "react";
import { ExtendedListing } from "../entities/ExtendedListing";
import ListingSection from "./ListingSection";
import SkeletonListingSection from "./skeletons/SkeletonListingSection";

interface Props {
  realEstateListings: Promise<ExtendedListing[]>;
}

const getCategoryUrl = (category: string) => {
  const encodedCategory = encodeURIComponent(category);
  return `/categories/${encodedCategory}`;
};

const generateSlides = (listing: ExtendedListing) => {
  return listing.images.map((image) => ({
    type: "image" as const,
    url: image.imageUrl,
  }));
};

const RealEstates = ({ realEstateListings }: Props) => {
  return (
    <div className="mt-16 bg-[#fafafa] rounded-md">
      <Suspense fallback={<SkeletonListingSection count={5} />}>
        <RealEstatesContent realEstateListingsPromise={realEstateListings} />
      </Suspense>
    </div>
  );
};

const RealEstatesContent = async ({
  realEstateListingsPromise,
}: {
  realEstateListingsPromise: Promise<ExtendedListing[]>;
}) => {
  const resolvedRealEstateListings = await realEstateListingsPromise;

  return (
    <ListingSection
      heading="Real Estate Listings"
      href={getCategoryUrl("real estate")}
      subheading="Discover your dream home"
      listings={resolvedRealEstateListings}
      generateSlides={generateSlides}
    />
  );
};

export default RealEstates;
