"use client";

import { ExtendedListing } from "../entities/ExtendedListing";
import LevelBadge from "./badges/Levelbadge";
import ProBadge from "./badges/Probadge";
import TopRatedBadge from "./badges/TopRatedBadge";
import ListingSection from "./ListingSection";

interface Props {
  realEstateListings: ExtendedListing[];
}

const RealEstates = ({ realEstateListings }: Props) => {
  const generateSlides = (listing: ExtendedListing) => {
    return listing.images.map((image) => ({
      type: "image" as const,
      url: image.imageUrl,
    }));
  };

  return (
    <div className="mt-16 bg-[#fafafa]">
      <ListingSection
        heading="Real Estate Listings"
        href="#"
        subheading="Discover your dream home"
        listings={realEstateListings}
        generateSlides={generateSlides}
      />
    </div>
  );
};

export default RealEstates;
