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

// Define the parameters for the getListings function
interface GetListingsParams {
  mainCategory: string;
  subCategory?: string;
  subSubCategory?: string;
  page: number;
  pageSize: number;
  location?: string;
  datePosted?: string;
  minPrice?: number;
  maxPrice?: number;
}

// Define the return type for the getListings function
interface GetListingsResult {
  listings: ExtendedListing[];
  totalCount: number;
}

const getCachedListings = unstable_cache(
  async ({
    mainCategory,
    subCategory,
    subSubCategory,
    page,
    pageSize,
    location,
    datePosted,
    minPrice,
    maxPrice,
  }: GetListingsParams): Promise<GetListingsResult> => {
    try {
      const whereClause: any = {};

      // Get the relevant category IDs based on the provided categories
      const categoryIds = await getCategoryIds(
        mainCategory,
        subCategory,
        subSubCategory
      );

      if (categoryIds.length > 0) {
        whereClause.categoryId = { in: categoryIds };
      }

      // Add location filter if provided
      if (location) {
        whereClause.location = { equals: location, mode: "insensitive" };
      }

      // Add date filter if provided
      if (datePosted) {
        whereClause.createdAt = { gte: getDateFilter(datePosted) };
      }

      // Add price range filter if provided
      if (minPrice !== undefined || maxPrice !== undefined) {
        whereClause.price = {};
        if (minPrice !== undefined) whereClause.price.gte = minPrice;
        if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
      }

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
      console.error("Error fetching listings:", error);
      return { listings: [], totalCount: 0 };
    }
  },
  ["listings"],
  { revalidate: 300, tags: ["listings"] }
);

export async function getListings(
  params: GetListingsParams
): Promise<GetListingsResult> {
  return getCachedListings(params);
}

// Helper function to get category IDs based on provided category parameters
async function getCategoryIds(
  mainCategory: string,
  subCategory?: string,
  subSubCategory?: string
): Promise<number[]> {
  // Fetch the category tree for the given main category
  const categoryTree = await prisma.category.findMany({
    where: {
      OR: [
        { name: { equals: mainCategory, mode: "insensitive" } },
        { parent: { name: { equals: mainCategory, mode: "insensitive" } } },
        {
          parent: {
            parent: { name: { equals: mainCategory, mode: "insensitive" } },
          },
        },
      ],
    },
    include: {
      children: {
        include: {
          children: true,
        },
      },
    },
  });

  if (categoryTree.length === 0) return [];

  const mainCat = categoryTree.find(
    (c) => c.name.toLowerCase() === mainCategory.toLowerCase()
  );
  if (!mainCat) return [];

  // If no subCategory is provided, return all related category IDs
  if (!subCategory) {
    return [
      mainCat.id,
      ...mainCat.children.map((sc) => sc.id),
      ...mainCat.children.flatMap((sc) => sc.children.map((ssc) => ssc.id)),
    ];
  }

  const subCat = mainCat.children.find(
    (c) => c.name.toLowerCase() === subCategory.toLowerCase()
  );
  if (!subCat) return [];

  // If no subSubCategory is provided, return subCategory and its children's IDs
  if (!subSubCategory) {
    return [subCat.id, ...subCat.children.map((ssc) => ssc.id)];
  }

  // If subSubCategory is provided, check if it's in the subCategory's description
  if (
    subCat.description?.toLowerCase().includes(subSubCategory.toLowerCase())
  ) {
    return [subCat.id];
  }

  return [];
}

// Helper function to get the date filter based on the datePosted parameter
function getDateFilter(datePosted: string): Date {
  const filterDate = new Date();
  switch (datePosted) {
    case "24h":
      filterDate.setDate(filterDate.getDate() - 1);
      break;
    case "7d":
      filterDate.setDate(filterDate.getDate() - 7);
      break;
    case "30d":
      filterDate.setDate(filterDate.getDate() - 30);
      break;
  }
  return filterDate;
}
