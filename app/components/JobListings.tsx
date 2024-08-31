"use client";

import React from "react";
import { Category, User, Image } from "@prisma/client";
import LevelBadge from "./badges/Levelbadge";
import ProBadge from "./badges/Probadge";
import TopRatedBadge from "./badges/TopRatedBadge";
import ListingSection from "./ListingSection";
import { ExtendedListing } from "../entities/ExtendedListing";

interface Props {
  jobListings: ExtendedListing[];
}

const JobListings = ({ jobListings }: Props) => {
  const generateSlides = (listing: ExtendedListing) => {
    return listing.images.map((image) => ({
      type: "image" as const,
      url: image.imageUrl,
    }));
  };

  // const getBadgeComponent = (listing: ExtendedSerializableListing) => {
  //   if (listing.user.rating && listing.user.rating > 4.5) return TopRatedBadge;
  //   if (listing.user.isPro) return ProBadge;
  //   return LevelBadge;
  // };

  // const offersVideo = (listing: ExtendedSerializableListing) => {
  //   return listing.offersVideoConsultation || false;
  // };

  return (
    <div className="mt-16">
      <ListingSection
        heading="Job Listing"
        href="#"
        subheading="Find the perfect job opportunity for you"
        listings={jobListings}
        generateSlides={generateSlides}
        // getBadgeComponent={getBadgeComponent}
        // offersVideo={offersVideo}
      />
    </div>
  );
};

export default JobListings;
