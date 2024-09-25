import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { Image } from "@prisma/client";

const DEFAULT_IMAGE: Image = {
  id: -1,
  imageUrl:
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1973&q=80",
  listingId: -1,
  createdAt: new Date(),
};

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
  console.log("--- getListings function start ---");
  // console.log("Received parameters:", {
  //   mainCategory,
  //   subCategory,
  //   subSubCategory,
  //   page,
  //   pageSize,
  //   location,
  //   datePosted,
  //   minPrice,
  //   maxPrice,
  // });

  try {
    // Fetch the entire category tree for the main category
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

    // console.log(`Found ${categoryTree.length} categories in the tree`);

    if (categoryTree.length === 0) {
      console.error(`Category "${mainCategory}" not found in the database.`);
      return { listings: [], totalCount: 0 };
    }

    // Find the target category and its subcategories
    let targetCategories: number[] = [];
    let mainCat = categoryTree.find(
      (c) => c.name.toLowerCase() === mainCategory.toLowerCase()
    );

    if (!mainCat) {
      console.error(`Main category "${mainCategory}" not found`);
      return { listings: [], totalCount: 0 };
    }

    if (!subCategory) {
      // If no subCategory, include all subcategories
      targetCategories = [
        mainCat.id,
        ...mainCat.children.map((sc) => sc.id),
        ...mainCat.children.flatMap((sc) => sc.children.map((ssc) => ssc.id)),
      ];
    } else {
      let subCat = mainCat.children.find(
        (c) => c.name.toLowerCase() === subCategory.toLowerCase()
      );
      if (!subCat) {
        console.error(`Sub-category "${subCategory}" not found`);
        return { listings: [], totalCount: 0 };
      }

      if (!subSubCategory) {
        // If no subSubCategory, include the subCategory and all its children
        targetCategories = [subCat.id, ...subCat.children.map((ssc) => ssc.id)];
      } else {
        // For subSubCategory, we need to check the description of the subCategory
        if (
          subCat.description
            ?.toLowerCase()
            .includes(subSubCategory.toLowerCase())
        ) {
          targetCategories = [subCat.id];
        } else {
          console.error(
            `Sub-sub-category "${subSubCategory}" not found in description of "${subCategory}"`
          );
          return { listings: [], totalCount: 0 };
        }
      }
    }

    console.log(`Target category IDs: ${targetCategories.join(", ")}`);

    // Build the where clause
    const whereClause: any = {
      categoryId: { in: targetCategories },
    };

    if (location) {
      whereClause.location = { equals: location, mode: "insensitive" };
      console.log(`Added location filter: ${location}`);
    }

    if (datePosted) {
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
      whereClause.createdAt = { gte: filterDate };
      console.log(
        `Added date filter: ${datePosted} (since ${filterDate.toISOString()})`
      );
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) {
        whereClause.price.gte = minPrice;
        console.log(`Added minimum price filter: ${minPrice}`);
      }
      if (maxPrice !== undefined) {
        whereClause.price.lte = maxPrice;
        console.log(`Added maximum price filter: ${maxPrice}`);
      }
    }

    console.log("Final where clause:", JSON.stringify(whereClause, null, 2));

    // Fetch listings and total count
    const [listings, totalCount] = await Promise.all([
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

    console.log(`Found ${listings.length} listings out of ${totalCount} total`);

    const result = {
      listings: listings.map(
        (listing): ExtendedListing => ({
          ...listing,
          price: listing.price?.toFixed(2) ?? "0.00",
          images: listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
        })
      ),
      totalCount,
    };

    console.log("--- getListings function end ---");
    return result;
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalCount: 0 };
  }
}

// import prisma from "@/prisma/client";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import { Image } from "@prisma/client";

// const DEFAULT_IMAGE: Image = {
//   id: -1,
//   imageUrl:
//     "https://plus.unsplash.com/premium_photo-1683746792239-6ce8cdd3ac78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   listingId: -1,
//   createdAt: new Date(),
// };

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
//     console.log("--- getListings function start ---");
//     console.log("Received parameters:", {
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       page,
//       pageSize,
//       location,
//       datePosted,
//       minPrice,
//       maxPrice,
//     });

//     let categoryIds: number[] = [];

//     // Find the main category
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
//       console.error(
//         `Main category "${mainCategory}" not found in the database.`
//       );
//       return { listings: [], totalCount: 0 };
//     }

//     console.log(
//       `Found main category: ${mainCategoryRecord.name} (ID: ${mainCategoryRecord.id})`
//     );

//     if (subCategory) {
//       const subCategoryRecord = mainCategoryRecord.children.find(
//         (c) =>
//           c.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase()
//       );

//       if (subCategoryRecord) {
//         console.log(
//           `Found sub-category: ${subCategoryRecord.name} (ID: ${subCategoryRecord.id})`
//         );

//         if (subSubCategory) {
//           // Check if subSubCategory exists in the description
//           const subSubCategoryItems =
//             subCategoryRecord.description?.split(", ") || [];
//           const subSubCategoryExists = subSubCategoryItems.some(
//             (item) =>
//               item.toLowerCase() ===
//               decodeURIComponent(subSubCategory).toLowerCase()
//           );

//           if (subSubCategoryExists) {
//             console.log(
//               `Found sub-sub-category: ${subSubCategory} in description`
//             );
//             categoryIds = [subCategoryRecord.id];
//           } else {
//             console.warn(
//               `Sub-sub-category "${subSubCategory}" not found in description. Falling back to sub-category.`
//             );
//             categoryIds = [subCategoryRecord.id];
//           }
//         } else {
//           categoryIds = [
//             subCategoryRecord.id,
//             ...subCategoryRecord.children.map((c) => c.id),
//           ];
//         }
//       } else {
//         console.warn(
//           `Sub-category "${subCategory}" not found. Falling back to main category.`
//         );
//         categoryIds = [mainCategoryRecord.id];
//       }
//     } else {
//       categoryIds = [
//         mainCategoryRecord.id,
//         ...mainCategoryRecord.children.map((c) => c.id),
//         ...mainCategoryRecord.children.flatMap((c) =>
//           c.children.map((gc) => gc.id)
//         ),
//       ];
//     }

//     console.log(
//       `Searching for listings in categories: ${categoryIds.join(", ")}`
//     );

//     // Build the where clause
//     const whereClause: any = {
//       categoryId: {
//         in: categoryIds,
//       },
//     };

//     // Add location filter
//     if (location) {
//       whereClause.location = {
//         equals: location,
//         mode: "insensitive",
//       };
//     }

//     // Add date posted filter
//     if (datePosted) {
//       const currentDate = new Date();
//       let filterDate = new Date();

//       switch (datePosted) {
//         case "24h":
//           filterDate.setDate(currentDate.getDate() - 1);
//           break;
//         case "7d":
//           filterDate.setDate(currentDate.getDate() - 7);
//           break;
//         case "30d":
//           filterDate.setDate(currentDate.getDate() - 30);
//           break;
//       }

//       whereClause.createdAt = {
//         gte: filterDate,
//       };
//     }

//     // Add price range filter
//     if (minPrice !== undefined || maxPrice !== undefined) {
//       whereClause.price = {};
//       if (minPrice !== undefined) {
//         whereClause.price.gte = minPrice;
//       }
//       if (maxPrice !== undefined) {
//         whereClause.price.lte = maxPrice;
//       }
//     }
//     console.log("Final where clause:", JSON.stringify(whereClause, null, 2));

//     const [listings, totalCount] = await Promise.all([
//       prisma.listing.findMany({
//         where: whereClause,
//         include: {
//           category: {
//             include: {
//               parent: true,
//             },
//           },
//           user: true,
//           images: true,
//           reviews: true,
//         },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//         orderBy: {
//           createdAt: "desc",
//         },
//       }),
//       prisma.listing.count({
//         where: whereClause,
//       }),
//     ]);

//     console.log(`Found ${listings.length} listings out of ${totalCount} total`);
//     console.log("--- getListings function end ---");

//     return {
//       listings: listings.map(
//         (listing): ExtendedListing => ({
//           ...listing,
//           price: listing.price?.toFixed(2) ?? "0.00",
//           images: listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
//         })
//       ),
//       totalCount,
//     };
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     return { listings: [], totalCount: 0 };
//   }
// }

// import prisma from "@/prisma/client";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import { Image } from "@prisma/client";

// const DEFAULT_IMAGE: Image = {
//   id: -1,
//   imageUrl:
//     "https://plus.unsplash.com/premium_photo-1683746792239-6ce8cdd3ac78?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//   listingId: -1,
//   createdAt: new Date(),
// };

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

// export async function getListings({
//   mainCategory,
//   subCategory,
//   subSubCategory,
//   page,
//   pageSize,
// }: GetListingsParams): Promise<GetListingsResult> {
//   try {
//     console.log("--- getListings function start ---");
//     console.log("Received parameters:");
//     console.log(`mainCategory: "${mainCategory}"`);
//     console.log(`subCategory: "${subCategory || "None"}"`);
//     console.log(`subSubCategory: "${subSubCategory || "None"}"`);
//     console.log(`page: ${page}, pageSize: ${pageSize}`);

//     let categoryIds: number[] = [];

//     // Find the main category
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
//       console.error(
//         `Main category "${mainCategory}" not found in the database.`
//       );
//       return { listings: [], totalCount: 0 };
//     }

//     console.log(
//       `Found main category: ${mainCategoryRecord.name} (ID: ${mainCategoryRecord.id})`
//     );

//     if (subCategory) {
//       const subCategoryRecord = mainCategoryRecord.children.find(
//         (c) =>
//           c.name.toLowerCase() === decodeURIComponent(subCategory).toLowerCase()
//       );

//       if (subCategoryRecord) {
//         console.log(
//           `Found sub-category: ${subCategoryRecord.name} (ID: ${subCategoryRecord.id})`
//         );

//         if (subSubCategory) {
//           // Check if subSubCategory exists in the description
//           const subSubCategoryItems =
//             subCategoryRecord.description?.split(", ") || [];
//           const subSubCategoryExists = subSubCategoryItems.some(
//             (item) =>
//               item.toLowerCase() ===
//               decodeURIComponent(subSubCategory).toLowerCase()
//           );

//           if (subSubCategoryExists) {
//             console.log(
//               `Found sub-sub-category: ${subSubCategory} in description`
//             );
//             categoryIds = [subCategoryRecord.id];
//           } else {
//             console.warn(
//               `Sub-sub-category "${subSubCategory}" not found in description. Falling back to sub-category.`
//             );
//             categoryIds = [subCategoryRecord.id];
//           }
//         } else {
//           categoryIds = [
//             subCategoryRecord.id,
//             ...subCategoryRecord.children.map((c) => c.id),
//           ];
//         }
//       } else {
//         console.warn(
//           `Sub-category "${subCategory}" not found. Falling back to main category.`
//         );
//         categoryIds = [mainCategoryRecord.id];
//       }
//     } else {
//       categoryIds = [
//         mainCategoryRecord.id,
//         ...mainCategoryRecord.children.map((c) => c.id),
//         ...mainCategoryRecord.children.flatMap((c) =>
//           c.children.map((gc) => gc.id)
//         ),
//       ];
//     }

//     console.log(
//       `Searching for listings in categories: ${categoryIds.join(", ")}`
//     );

//     const [listings, totalCount] = await Promise.all([
//       prisma.listing.findMany({
//         where: {
//           categoryId: {
//             in: categoryIds,
//           },
//         },
//         include: {
//           category: true,
//           user: true,
//           images: true,
//           reviews: true,
//         },
//         skip: (page - 1) * pageSize,
//         take: pageSize,
//         orderBy: {
//           createdAt: "desc",
//         },
//       }),
//       prisma.listing.count({
//         where: {
//           categoryId: {
//             in: categoryIds,
//           },
//         },
//       }),
//     ]);

//     console.log(`Found ${listings.length} listings out of ${totalCount} total`);
//     console.log("--- getListings function end ---");

//     return {
//       listings: listings.map(
//         (listing): ExtendedListing => ({
//           ...listing,
//           price: listing.price?.toFixed(2) ?? "0.00",
//           images: listing.images.length > 0 ? listing.images : [DEFAULT_IMAGE],
//         })
//       ),
//       totalCount,
//     };
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     return { listings: [], totalCount: 0 };
//   }
// }
