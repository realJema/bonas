"use client";

import { ExtendedListing } from "../entities/ExtendedListing";
import LevelBadge from "./badges/Levelbadge";
import ProBadge from "./badges/Probadge";
import TopRatedBadge from "./badges/TopRatedBadge";
import ListingSection from "./ListingSection";

interface Props {
  vehiclesAndMotorListings: ExtendedListing[];
}

const VehiculesAndMotor = ({ vehiclesAndMotorListings }: Props) => {
  const generateSlides = (listing: ExtendedListing) => {
    return listing.images.map((image) => ({
      type: "image" as const,
      url: image.imageUrl,
    }));
  };

  const getCategoryUrl = (category: string) => {
    const encodedCategory = encodeURIComponent(category);
    return `/categories/${encodedCategory}`;
  };


  return (
    <div className="mt-52 flex flex-col bg-[#fafafa] rounded-md">
      <ListingSection
        heading="Vehicles and Motor"
        href={getCategoryUrl('vehicles')}
        subheading="Hand-vetted talent for all your professional needs"
        listings={vehiclesAndMotorListings}
        generateSlides={generateSlides}
      />
    </div>
  );
};

export default VehiculesAndMotor;
