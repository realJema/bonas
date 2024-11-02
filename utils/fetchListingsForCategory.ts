"use server";

import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getListings } from "@/utils/getListings";

export const fetchListingsForCategory = cache(
  async (category: string, page = 1, pageSize = 10) => {
    return unstable_cache(
      async () => {
        const { listings } = await getListings({
          mainCategory: category,
          page,
          pageSize,
        });
        return listings;
      },
      [`category-listings-${category}-${page}-${pageSize}`],
      {
        revalidate: 300,
        tags: ["listings"],
      }
    )();
  }
);
