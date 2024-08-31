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

  return (
    <div className="mt-52 flex flex-col space-y-6">
      <ListingSection
        heading="Vehicules and Motor"
        href="#"
        subheading="Hand-vetted talent for all your professional needs"
        listings={vehiclesAndMotorListings}
        generateSlides={generateSlides}
      />
    </div>
  );
};

export default VehiculesAndMotor;
