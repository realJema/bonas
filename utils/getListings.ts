// utils/getListings.ts
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import prisma from "@/prisma/client";
import { formatListings } from "./formatListings";

export const maxDuration = 60;

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

interface GetListingsResult {
  listings: ExtendedListing[];
  totalCount: number;
}

function getDateFilter(datePosted: string): Date {
  const now = new Date();
  const filterDate = new Date(now);

  switch (datePosted) {
    case "24h":
      filterDate.setHours(now.getHours() - 24);
      break;
    case "7d":
      filterDate.setDate(now.getDate() - 7);
      break;
    case "14d":
      filterDate.setDate(now.getDate() - 14);
      break;
    case "30d":
      filterDate.setDate(now.getDate() - 30);
      break;
    default:
      return new Date(0);
  }
  return filterDate;
}

export async function getListings({
  mainCategory,
  subCategory,
  subSubCategory,
  page,
  pageSize,
  location,
  datePosted,
  minPrice,
  maxPrice,
}: GetListingsParams): Promise<GetListingsResult> {
  try {
    // Added debug logging for pagination
    console.log("Fetching page:", page, "with pageSize:", pageSize);

    // Get category hierarchy in one query
    const mainCategoryRecord = await prisma.category.findFirst({
      where: {
        name: { equals: mainCategory, mode: "insensitive" },
        parentId: null,
      },
      include: {
        children: {
          include: {
            children: true,
          },
        },
      },
    });

    if (!mainCategoryRecord) {
      return { listings: [], totalCount: 0 };
    }

    // Build category IDs array efficiently
    const categoryIds = new Set<number>([mainCategoryRecord.id]);

    if (subCategory) {
      const subCategoryRecord = mainCategoryRecord.children.find(
        (child) => child.name.toLowerCase() === subCategory.toLowerCase()
      );

      if (subCategoryRecord) {
        if (subSubCategory) {
          const subSubCategoryRecord = subCategoryRecord.children.find(
            (child) => child.name.toLowerCase() === subSubCategory.toLowerCase()
          );
          if (subSubCategoryRecord) {
            categoryIds.add(subSubCategoryRecord.id);
          }
        } else {
          categoryIds.add(subCategoryRecord.id);
          subCategoryRecord.children.forEach((child) =>
            categoryIds.add(child.id)
          );
        }
      }
    } else {
      mainCategoryRecord.children.forEach((subCat) => {
        categoryIds.add(subCat.id);
        subCat.children.forEach((subSubCat) => categoryIds.add(subSubCat.id));
      });
    }

    const whereClause: any = {
      subcategory_id: {
        in: Array.from(categoryIds).map((id) => BigInt(id)),
      },
    };

    if (location) {
      whereClause.town = {
        equals: location,
        mode: "insensitive",
      };
    }

    if (datePosted) {
      const filterDate = getDateFilter(datePosted);
      whereClause.created_at = {
        gte: filterDate,
        lte: new Date(),
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price.gte = minPrice;
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
    }

    // Added debug logging for pagination calculation
    const skip = Math.max(0, (page - 1) * pageSize);
    console.log("Calculated skip:", skip);

    // Optimized query with specific field selection
    const [listings, totalCount] = await prisma.$transaction([
      prisma.listing.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              profilePicture: true,
            },
          },
        },
        skip: skip, // Ensure skip is always non-negative
        take: pageSize,
        orderBy: { created_at: "desc" },
      }),
      prisma.listing.count({ where: whereClause }),
    ]);

    // Added debug logging for results
    console.log("Found listings:", listings.length, "Total:", totalCount);

    const formattedListings = formatListings(listings);

    return {
      listings: formattedListings,
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalCount: 0 };
  }
}



// // utils/getListings.ts
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import prisma from "@/prisma/client";
// import { formatListings } from "./formatListings";

// export const maxDuration = 60;

// interface GetListingsParams {
//   mainCategory: string;
//   subCategory?: string;
//   subSubCategory?: string;
//   page: number;
//   pageSize: number;
//   location?: string;
//   datePosted?: string;
//   minPrice?: number;
//   maxPrice?: number;
// }

// interface GetListingsResult {
//   listings: ExtendedListing[];
//   totalCount: number;
// }

// function getDateFilter(datePosted: string): Date {
//   const now = new Date();
//   const filterDate = new Date(now);

//   switch (datePosted) {
//     case "24h":
//       filterDate.setHours(now.getHours() - 24);
//       break;
//     case "7d":
//       filterDate.setDate(now.getDate() - 7);
//       break;
//     case "14d":
//       filterDate.setDate(now.getDate() - 14);
//       break;
//     case "30d":
//       filterDate.setDate(now.getDate() - 30);
//       break;
//     default:
//       return new Date(0);
//   }
//   return filterDate;
// }

// export async function getListings({
//   mainCategory,
//   subCategory,
//   subSubCategory,
//   page,
//   pageSize,
//   location,
//   datePosted,
//   minPrice,
//   maxPrice,
// }: GetListingsParams): Promise<GetListingsResult> {
//   try {
//     // Get category hierarchy in one query
//     const mainCategoryRecord = await prisma.category.findFirst({
//       where: {
//         name: { equals: mainCategory, mode: "insensitive" },
//         parentId: null,
//       },
//       include: {
//         children: {
//           include: {
//             children: true,
//           },
//         },
//       },
//     });

//     if (!mainCategoryRecord) {
//       return { listings: [], totalCount: 0 };
//     }

//     // Build category IDs array efficiently
//     const categoryIds = new Set<number>([mainCategoryRecord.id]);

//     if (subCategory) {
//       const subCategoryRecord = mainCategoryRecord.children.find(
//         (child) => child.name.toLowerCase() === subCategory.toLowerCase()
//       );

//       if (subCategoryRecord) {
//         if (subSubCategory) {
//           const subSubCategoryRecord = subCategoryRecord.children.find(
//             (child) => child.name.toLowerCase() === subSubCategory.toLowerCase()
//           );
//           if (subSubCategoryRecord) {
//             categoryIds.add(subSubCategoryRecord.id);
//           }
//         } else {
//           categoryIds.add(subCategoryRecord.id);
//           subCategoryRecord.children.forEach((child) =>
//             categoryIds.add(child.id)
//           );
//         }
//       }
//     } else {
//       mainCategoryRecord.children.forEach((subCat) => {
//         categoryIds.add(subCat.id);
//         subCat.children.forEach((subSubCat) => categoryIds.add(subSubCat.id));
//       });
//     }

//     const whereClause: any = {
//       subcategory_id: {
//         in: Array.from(categoryIds).map((id) => BigInt(id)), // Convert to BigInt
//       },
//     };

//     if (location) {
//       whereClause.town = {
//         equals: location,
//         mode: "insensitive",
//       };
//     }

//     if (datePosted) {
//       const filterDate = getDateFilter(datePosted);
//       whereClause.created_at = {
//         gte: filterDate,
//         lte: new Date(),
//       };
//     }

//     if (minPrice !== undefined || maxPrice !== undefined) {
//       whereClause.price = {};
//       if (minPrice !== undefined) whereClause.price.gte = minPrice;
//       if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
//     }

//     // Optimized query with specific field selection
//     const [listings, totalCount] = await prisma.$transaction([
//       prisma.listing.findMany({
//         where: whereClause,
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               username: true,
//               image: true,
//               profilePicture: true,
//             },
//           },
//         },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//         orderBy: { created_at: "desc" },
//       }),
//       prisma.listing.count({ where: whereClause }),
//     ]);

//     const formattedListings = formatListings(listings);

//     return { listings: formattedListings, totalCount };
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     return { listings: [], totalCount: 0 };
//   }
// }
