import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getListings } from "./getListings";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

export const maxDuration = 60;

export const getVehiclesListings = cache(
  async (page = 1, pageSize = 10): Promise<ExtendedListing[]> => {
    return unstable_cache(
      async () => {
        const { listings } = await getListings({
          mainCategory: "Vehicles",
          page,
          pageSize,
        });
        return listings;
      },
      [`vehicles-listings-${page}-${pageSize}`],
      {
        revalidate: 300,
        tags: ["vehicles"],
      }
    )();
  }
);
