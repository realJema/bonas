import { unstable_cache } from "next/cache";
import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { Image } from "@prisma/client";

// Set the maximum duration for this function to 60 seconds
export const maxDuration = 60;

// Define a default image to use when a listing has no images
const DEFAULT_IMAGE: Image = {
  id: -1,
  imageUrl:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
  listingId: -1,
  createdAt: new Date(),
};

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
  { revalidate: 300, tags: ["listings-by-user-id"] }
);

export async function getListingsByUserId(
  params: GetListingsByUserIdParams
): Promise<GetListingsByUserIdResult> {
  return getCachedListingsByUserId(params);
}