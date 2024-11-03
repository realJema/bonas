// utils/getListings.ts
import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";

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
    case "30d":
      filterDate.setDate(now.getDate() - 30);
      break;
    default:
      return new Date(0);
  }
  return filterDate;
}

// Optimized database fetch function
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
    // Optimized category query with single database call
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
      categoryId: {
        in: Array.from(categoryIds),
      },
    };

    if (location) {
      whereClause.location = {
        equals: location,
        mode: "insensitive",
      };
    }

    if (datePosted) {
      const filterDate = getDateFilter(datePosted);
      whereClause.createdAt = {
        gte: filterDate,
        lte: new Date(),
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price.gte = minPrice;
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
    }

    // Optimized query with specific field selection
    const [listings, totalCount] = await prisma.$transaction([
      prisma.listing.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          budget: true,
          location: true,
          createdAt: true,
          updatedAt: true,
          category: {
            select: {
              id: true,
              name: true,
              parent: {
                select: {
                  id: true,
                  name: true,
                  parent: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              profilePicture: true,
            },
          },
          images: {
            select: {
              imageUrl: true,
            },
          },
          reviews: {
            select: {
              rating: true,
              comment: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.listing.count({ where: whereClause }),
    ]);

    return {
      listings: listings.map(
        (listing: any): ExtendedListing => ({
          ...listing,
          price: listing.price?.toFixed(2) ?? "0.00",
          images: listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
          category: listing.category,
          user: listing.user,
          review: listing.reviews,
        })
      ),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalCount: 0 };
  }
}




// import { unstable_cache } from "next/cache";
// import prisma from "@/prisma/client";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import { DEFAULT_IMAGE } from "@/utils/imageUtils";
// import { cache } from "react";

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
//     case "30d":
//       filterDate.setDate(now.getDate() - 30);
//       break;
//     default:
//       return new Date(0);
//   }
//   return filterDate;
// }

// const fetchListingsFromDB = async ({
//   mainCategory,
//   subCategory,
//   subSubCategory,
//   page,
//   pageSize,
//   location,
//   datePosted,
//   minPrice,
//   maxPrice,
// }: GetListingsParams): Promise<GetListingsResult> => {
//   try {
//     // First, find the main category
//     const mainCategoryRecord = await prisma.category.findFirst({
//       where: {
//         name: { equals: mainCategory, mode: "insensitive" },
//         parentId: null, // Main categories have no parent
//       },
//     });

//     if (!mainCategoryRecord) {
//       return { listings: [], totalCount: 0 };
//     }

//     // Build category IDs array based on the hierarchy
//     let categoryIds: number[] = [];

//     if (subCategory) {
//       // Find sub-category under main category
//       const subCategoryRecord = await prisma.category.findFirst({
//         where: {
//           name: { equals: subCategory, mode: "insensitive" },
//           parentId: mainCategoryRecord.id,
//         },
//         include: {
//           children: true, // Include sub-sub categories
//         },
//       });

//       if (subCategoryRecord) {
//         if (subSubCategory) {
//           // Find specific sub-sub category
//           const subSubCategoryRecord = subCategoryRecord.children.find(
//             (child) => child.name.toLowerCase() === subSubCategory.toLowerCase()
//           );
//           if (subSubCategoryRecord) {
//             categoryIds = [subSubCategoryRecord.id];
//           }
//         } else {
//           // Include sub-category and all its children
//           categoryIds = [
//             subCategoryRecord.id,
//             ...subCategoryRecord.children.map((child) => child.id),
//           ];
//         }
//       }
//     } else {
//       // Get all categories under main category
//       const fullHierarchy = await prisma.category.findMany({
//         where: {
//           OR: [
//             { id: mainCategoryRecord.id },
//             { parentId: mainCategoryRecord.id },
//             {
//               parent: {
//                 parentId: mainCategoryRecord.id,
//               },
//             },
//           ],
//         },
//       });
//       categoryIds = fullHierarchy.map((cat) => cat.id);
//     }

//     const whereClause: any = {
//       categoryId: {
//         in: categoryIds,
//       },
//     };

//     // Add location filter if provided
//     if (location) {
//       whereClause.location = {
//         equals: location,
//         mode: "insensitive",
//       };
//     }

//     // Add date filter if provided
//     if (datePosted) {
//       const filterDate = getDateFilter(datePosted);
//       whereClause.createdAt = {
//         gte: filterDate,
//         lte: new Date(),
//       };
//     }

//     // Add price filter if provided
//     if (minPrice !== undefined || maxPrice !== undefined) {
//       whereClause.price = {};
//       if (minPrice !== undefined) whereClause.price.gte = minPrice;
//       if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
//     }

//     // Fetch listings with related data
//     const [listings, totalCount] = await prisma.$transaction([
//       prisma.listing.findMany({
//         where: whereClause,
//         include: {
//           category: {
//             include: {
//               parent: {
//                 include: {
//                   parent: true,
//                 },
//               },
//             },
//           },
//           user: true,
//           images: true,
//           reviews: true,
//         },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//         orderBy: { createdAt: "desc" },
//       }),
//       prisma.listing.count({ where: whereClause }),
//     ]);

//     return {
//       listings: listings.map(
//         (listing): ExtendedListing => ({
//           ...listing,
//           price: listing.price?.toFixed(2) ?? "0.00",
//           images: listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
//           category: listing.category!,
//           user: listing.user,
//           review: listing.reviews,
//         })
//       ),
//       totalCount,
//     };
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     return { listings: [], totalCount: 0 };
//   }
// };

// // Wrap the database fetch with caching
// export const getListings = cache(
//   async (params: GetListingsParams): Promise<GetListingsResult> => {
//     return unstable_cache(
//       async () => fetchListingsFromDB(params),
//       [`listings-${JSON.stringify(params)}`], // Create unique cache key based on all params
//       {
//         revalidate: 60, // Revalidate cache every 60 seconds
//         tags: ["listings"], // Tag for cache invalidation
//       }
//     )();
//   }
// );

// // newly updated:

// import { unstable_cache } from "next/cache";
// import prisma from "@/prisma/client";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import { DEFAULT_IMAGE } from "@/utils/imageUtils";
// import { cache } from "react";

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
//     case "30d":
//       filterDate.setDate(now.getDate() - 30);
//       break;
//     default:
//       return new Date(0);
//   }
//   return filterDate;
// }

// const getCachedListings = unstable_cache(
//   async ({
//     mainCategory,
//     subCategory,
//     subSubCategory,
//     page,
//     pageSize,
//     location,
//     datePosted,
//     minPrice,
//     maxPrice,
//   }: GetListingsParams): Promise<GetListingsResult> => {
//     try {
//       // First, find the main category
//       const mainCategoryRecord = await prisma.category.findFirst({
//         where: {
//           name: { equals: mainCategory, mode: "insensitive" },
//           parentId: null, // Main categories have no parent
//         },
//       });

//       if (!mainCategoryRecord) {
//         return { listings: [], totalCount: 0 };
//       }

//       // Build category IDs array based on the hierarchy
//       let categoryIds: number[] = [];

//       if (subCategory) {
//         // Find sub-category under main category
//         const subCategoryRecord = await prisma.category.findFirst({
//           where: {
//             name: { equals: subCategory, mode: "insensitive" },
//             parentId: mainCategoryRecord.id,
//           },
//           include: {
//             children: true, // Include sub-sub categories
//           },
//         });

//         if (subCategoryRecord) {
//           if (subSubCategory) {
//             // Find specific sub-sub category
//             const subSubCategoryRecord = subCategoryRecord.children.find(
//               (child) =>
//                 child.name.toLowerCase() === subSubCategory.toLowerCase()
//             );
//             if (subSubCategoryRecord) {
//               categoryIds = [subSubCategoryRecord.id];
//             }
//           } else {
//             // Include sub-category and all its children
//             categoryIds = [
//               subCategoryRecord.id,
//               ...subCategoryRecord.children.map((child) => child.id),
//             ];
//           }
//         }
//       } else {
//         // Get all categories under main category
//         const fullHierarchy = await prisma.category.findMany({
//           where: {
//             OR: [
//               { id: mainCategoryRecord.id },
//               { parentId: mainCategoryRecord.id },
//               {
//                 parent: {
//                   parentId: mainCategoryRecord.id,
//                 },
//               },
//             ],
//           },
//         });
//         categoryIds = fullHierarchy.map((cat) => cat.id);
//       }

//       const whereClause: any = {
//         categoryId: {
//           in: categoryIds,
//         },
//       };

//       // Add location filter if provided
//       if (location) {
//         whereClause.location = {
//           equals: location,
//           mode: "insensitive",
//         };
//       }

//       if (datePosted) {
//         const filterDate = getDateFilter(datePosted);
//         whereClause.createdAt = {
//           gte: filterDate,
//           lte: new Date(),
//         };
//       }

//       if (minPrice !== undefined || maxPrice !== undefined) {
//         whereClause.price = {};
//         if (minPrice !== undefined) whereClause.price.gte = minPrice;
//         if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
//       }

//       // Fetch listings with related data
//       const [listings, totalCount] = await prisma.$transaction([
//         prisma.listing.findMany({
//           where: whereClause,
//           include: {
//             category: {
//               include: {
//                 parent: {
//                   include: {
//                     parent: true,
//                   },
//                 },
//               },
//             },
//             user: true,
//             images: true,
//             reviews: true,
//           },
//           skip: (page - 1) * pageSize,
//           take: pageSize,
//           orderBy: { createdAt: "desc" },
//         }),
//         prisma.listing.count({ where: whereClause }),
//       ]);

//       return {
//         listings: listings.map(
//           (listing): ExtendedListing => ({
//             ...listing,
//             price: listing.price?.toFixed(2) ?? "0.00",
//             images:
//               listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
//             category: listing.category!,
//             user: listing.user,
//             review: listing.reviews,
//           })
//         ),
//         totalCount,
//       };
//     } catch (error) {
//       console.error("Error fetching listings:", error);
//       return { listings: [], totalCount: 0 };
//     }
//   },
//   ["listings"],
//   { revalidate: false, tags: ["listings"] }
// );

// export async function getListings(
//   params: GetListingsParams
// ): Promise<GetListingsResult> {
//   return getCachedListings(params);
// }
