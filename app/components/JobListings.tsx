"use client";

import React, { Suspense } from "react";
import { ExtendedListing } from "../entities/ExtendedListing";
import ListingSection from "./ListingSection";
import { generateSlides } from "@/lib/generateSlides";
import SkeletonSwiper from "./swiper/SkeletonSwiper";

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
      <Suspense fallback={<SkeletonSwiper count={5} />}>
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

// "use client";

// import React from "react";
// import { Category, User, Image } from "@prisma/client";
// import LevelBadge from "./badges/Levelbadge";
// import ProBadge from "./badges/Probadge";
// import TopRatedBadge from "./badges/TopRatedBadge";
// import ListingSection from "./ListingSection";
// import { ExtendedListing } from "../entities/ExtendedListing";
// import { generateSlides } from "@/lib/generateSlides";

// interface Props {
//   jobListings: Promise<ExtendedListing[]>;
// }

// const JobListings = ({ jobListings }: Props) => {
//   // const getBadgeComponent = (listing: ExtendedSerializableListing) => {
//   //   if (listing.user.rating && listing.user.rating > 4.5) return TopRatedBadge;
//   //   if (listing.user.isPro) return ProBadge;
//   //   return LevelBadge;
//   // };

//   // const offersVideo = (listing: ExtendedSerializableListing) => {
//   //   return listing.offersVideoConsultation || false;
//   // };

//   const getCategoryUrl = (category: string) => {
//     const encodedCategory = encodeURIComponent(category);
//     return `/categories/${encodedCategory}`;
//   };

//   return (
//     <div className="mt-16 bg-[#fafafa] rounded-md">
//       <ListingSection
//         heading="Job Listing"
//         href={getCategoryUrl("jobs")}
//         subheading="Find the perfect job opportunity for you"
//         listings={jobListings}
//         generateSlides={generateSlides}
//         // getBadgeComponent={getBadgeComponent}
//         // offersVideo={offersVideo}
//       />
//     </div>
//   );
// };

// export default JobListings;
