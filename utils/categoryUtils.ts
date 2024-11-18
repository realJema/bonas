import { getCategoryPath } from "@/actions/getCategoryPath";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import prisma from "@/prisma/client";

export async function buildListingUrl(listing: ExtendedListing): Promise<string> {
  if (!listing.subcategory_id) {
    throw new Error("Listing must have a subcategory_id");
  }

  try {
    const [mainCategory, subCategory, subSubCategory] = await getCategoryPath(listing.subcategory_id);
    return `/${mainCategory}/${subCategory}/${subSubCategory}/${listing.id}`;
  } catch (error) {
    console.error('Error building listing URL:', error);
    throw error;
  }
}

// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import { Category } from "@prisma/client";

// type CategoryWithParent = Category & {
//   parent?: CategoryWithParent;
// };

// /**
//  * Gets the category from subcategory_id
//  * This is a temporary function until we implement proper category fetching
//  */
// const getDefaultCategory = (subcategoryId: string | null): string => {
//   // You might want to implement proper category mapping here
//   return "general";
// };

// /**
//  * Builds the complete URL for a listing using the new schema
//  */
// export const buildListingUrl = (listing: ExtendedListing): string => {
//   // If we don't have a subcategory_id, use a default route
//   if (!listing.subcategory_id) {
//     return `/listings/${listing.id}`;
//   }

//   // Get the category path - this is a simplified version
//   // You might want to implement proper category hierarchy fetching
//   const category = getDefaultCategory(listing.subcategory_id);

//   return `/listings/${category}/${listing.id}`;
// };

// /**
//  * Gets the category URL
//  */
// export const getCategoryUrl = (category: string) => {
//   const encodedCategory = encodeURIComponent(category);
//   return `/categories/${encodedCategory}`;
// };

// /**
//  * Original category path function - kept for reference when implementing
//  * proper category hierarchy
//  */
// export const getCategoryPath = (category: CategoryWithParent): string[] => {
//   const path: string[] = [];
//   let currentCategory: CategoryWithParent | undefined = category;

//   while (currentCategory) {
//     path.unshift(currentCategory.name.toLowerCase());
//     currentCategory = currentCategory.parent;
//   }

//   while (path.length < 3) {
//     path.push(path[path.length - 1] || "");
//   }

//   return path.slice(0, 3);
// };

// /**
//  * Validates if a listing URL matches its category
//  */
// export const validateListingUrl = (
//   listing: ExtendedListing,
//   category: string
// ): boolean => {
//   const expectedCategory = getDefaultCategory(listing.subcategory_id);
//   return expectedCategory.toLowerCase() === category.toLowerCase();
// };

// // import { Category } from "@prisma/client";

// // type CategoryWithParent = Category & {
// //   parent?: CategoryWithParent;
// // };

// // /**
// //  * Gets the full category path from the category hierarchy
// //  */
// // export const getCategoryPath = (category: CategoryWithParent): string[] => {
// //   const path: string[] = [];
// //   let currentCategory: CategoryWithParent | undefined = category;

// //   // Build the path from bottom up
// //   while (currentCategory) {
// //     path.unshift(currentCategory.name.toLowerCase());
// //     currentCategory = currentCategory.parent;
// //   }

// //   // Ensure we have exactly three levels by padding with the last known category
// //   while (path.length < 3) {
// //     path.push(path[path.length - 1] || "");
// //   }

// //   // Ensure we only return three levels
// //   return path.slice(0, 3);
// // };

// // /**
// //  * Builds the complete URL for a listing
// //  */
// // export const buildListingUrl = (listing: {
// //   id: string | number;
// //   category: CategoryWithParent;
// // }): string => {
// //   const categoryPath = getCategoryPath(listing.category);

// //   return `/${categoryPath.map(encodeURIComponent).join("/")}/${listing.id}`;
// // };

// // /**
// //  * Helper function to validate if a listing URL matches its category hierarchy
// //  */
// // export const validateListingUrl = (
// //   listing: {
// //     id: string | number;
// //     category: CategoryWithParent;
// //   },
// //   mainCategory: string,
// //   subCategory: string,
// //   subSubCategory: string
// // ): boolean => {
// //   const [expectedMain, expectedSub, expectedSubSub] = getCategoryPath(
// //     listing.category
// //   );

// //   return (
// //     expectedMain === mainCategory.toLowerCase() &&
// //     expectedSub === subCategory.toLowerCase() &&
// //     expectedSubSub === subSubCategory.toLowerCase()
// //   );
// // };

// // /**  */

// // export const getCategoryUrl = (category: string) => {
// //   const encodedCategory = encodeURIComponent(category);
// //   return `/categories/${encodedCategory}`;
// // };
