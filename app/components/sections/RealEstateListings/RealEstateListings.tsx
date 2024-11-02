"use client";

import { ExtendedListing } from "@/app/entities/ExtendedListing";
import React, { Suspense } from "react";
import SkeletonListingSection from "../../skeletons/SkeletonListingSection";
import ListingSection from "../../ListingSection";

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

const RealEstatesContent = async ({
  realEstateListings,
}: {
  realEstateListings: Promise<ExtendedListing[]>;
}) => {
  const listings = await realEstateListings;

  return (
    <ListingSection
      heading="Real Estate Listings"
      href={getCategoryUrl("real estate")}
      subheading="Discover your dream home"
      listings={listings}
      generateSlides={generateSlides}
    />
  );
};

const RealEstates = ({ realEstateListings }: Props) => {
  return (
    <div className="mt-16 bg-[#fafafa] rounded-md">
      <Suspense fallback={<SkeletonListingSection count={5} />}>
        <RealEstatesContent realEstateListings={realEstateListings} />
      </Suspense>
    </div>
  );
};

export default RealEstates;

// "use client";

// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import React, { Suspense } from "react";
// import SkeletonListingSection from "../../skeletons/SkeletonListingSection";
// import ListingSection from "../../ListingSection";

// interface Props {
//   realEstateListings: Promise<ExtendedListing[]>;
// }

// const getCategoryUrl = (category: string) => {
//   const encodedCategory = encodeURIComponent(category);
//   return `/categories/${encodedCategory}`;
// };

// const generateSlides = (listing: ExtendedListing) => {
//   return listing.images.map((image) => ({
//     type: "image" as const,
//     url: image.imageUrl,
//   }));
// };

// const RealEstates = ({ realEstateListings }: Props) => {
//   return (
//     <div className="mt-16 bg-[#fafafa] rounded-md">
//       <Suspense fallback={<SkeletonListingSection count={5} />}>
//         <RealEstatesContent realEstateListingsPromise={realEstateListings} />
//       </Suspense>
//     </div>
//   );
// };

// const RealEstatesContent = async ({
//   realEstateListingsPromise,
// }: {
//   realEstateListingsPromise: Promise<ExtendedListing[]>;
// }) => {
//   const resolvedRealEstateListings = await realEstateListingsPromise;

//   return (
//     <ListingSection
//       heading="Real Estate Listings"
//       href={getCategoryUrl("real estate")}
//       subheading="Discover your dream home"
//       listings={resolvedRealEstateListings}
//       generateSlides={generateSlides}
//     />
//   );
// };

// export default RealEstates;
