"use client";

import { ExtendedListing } from "@/app/entities/ExtendedListing";
import React, { Suspense } from "react";
import SkeletonListingSection from "../../skeletons/SkeletonListingSection";
import ListingSection from "../../ListingSection";


interface Props {
  vehiclesAndMotorListings: Promise<ExtendedListing[]>;
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

const VehiculesAndMotor = ({ vehiclesAndMotorListings }: Props) => {
  return (
    <div className="mt-52 flex flex-col bg-[#fafafa] rounded-md">
      <Suspense fallback={<SkeletonListingSection count={5} />}>
        <VehiculesAndMotorContent
          vehiclesAndMotorListingsPromise={vehiclesAndMotorListings}
        />
      </Suspense>
    </div>
  );
};

const VehiculesAndMotorContent = async ({
  vehiclesAndMotorListingsPromise,
}: {
  vehiclesAndMotorListingsPromise: Promise<ExtendedListing[]>;
}) => {
  const resolvedVehiclesAndMotorListings =
    await vehiclesAndMotorListingsPromise;

  return (
    <ListingSection
      heading="Vehicles and Motor"
      href={getCategoryUrl("vehicles")}
      subheading="Hand-vetted talent for all your professional needs"
      listings={resolvedVehiclesAndMotorListings}
      generateSlides={generateSlides}
    />
  );
};

export default VehiculesAndMotor;
