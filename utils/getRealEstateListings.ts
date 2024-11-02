import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getListings } from "./getListings";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

export const maxDuration = 60;

export const getRealEstateListings = cache(
  async (page = 1, pageSize = 10): Promise<ExtendedListing[]> => {
    return unstable_cache(
      async () => {
        const { listings } = await getListings({
          mainCategory: "Real Estate",
          page,
          pageSize,
        });
        return listings;
      },
      [`real-estate-listings-${page}-${pageSize}`],
      {
        revalidate: 300,
        tags: ["real-estate"],
      }
    )();
  }
);

// import { cache } from "react";
// import { unstable_cache } from "next/cache";
// import { getListings } from "./getListings";

// export const maxDuration = 60;

// export const getRealEstateListings = cache(async (page = 1, pageSize = 10) => {
//   return unstable_cache(
//     async () =>
//       getListings({
//         mainCategory: "Real Estate",
//         page,
//         pageSize,
//       }),
//     [`real-estate-listings-${page}-${pageSize}`],
//     {
//       revalidate: 300,
//       tags: ["real-estate"],
//     }
//   )();
// });
