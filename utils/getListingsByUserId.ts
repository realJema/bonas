import { unstable_cache } from "next/cache";
import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";

// Set the maximum duration for this function to 60 seconds
export const maxDuration = 60;

// Define the parameters for the getListingsByUserId function
interface GetListingsByUserIdParams {
  userId: string;
  page: number;
  pageSize: number;
}

// Define the return type for the getListingsByUserId function
interface GetListingsByUserIdResult {
  listings: ExtendedListing[];
  totalCount: number;
}

const getCachedListingsByUserId = unstable_cache(
  async ({
    userId,
    page,
    pageSize,
  }: GetListingsByUserIdParams): Promise<GetListingsByUserIdResult> => {
    try {
      const whereClause = {
        userId: userId,
      };

      // const timestamp = Date.now();
      // console.log(`Cache busting timestamp: ${timestamp}`);

      // Fetch listings and total count in a single transaction
      const [listings, totalCount] = await prisma.$transaction([
        prisma.listing.findMany({
          where: whereClause,
          include: {
            category: { include: { parent: true } },
            user: true,
            images: true,
            reviews: true,
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { createdAt: "desc" },
        }),
        prisma.listing.count({ where: whereClause }),
      ]);

      // Format the listings and return the result
      return {
        listings: listings.map(
          (listing): ExtendedListing => ({
            ...listing,
            price: listing.price?.toFixed(2) ?? "0.00",
            images:
              listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
            category: listing.category!,
            user: listing.user,
            review: listing.reviews,
          })
        ),
        totalCount,
      };
    } catch (error) {
      console.error("Error fetching listings by user ID:", error);
      return { listings: [], totalCount: 0 };
    }
  },
  ["listings-by-user-id"],
  { revalidate: false, tags: ["listings-by-user-id"] }
);

export async function getListingsByUserId(
  params: GetListingsByUserIdParams
): Promise<GetListingsByUserIdResult> {
  return getCachedListingsByUserId(params);
}
