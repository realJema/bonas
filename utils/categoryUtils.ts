// app/utils/categoryUtils.ts
import { getCategoryPath } from "@/actions/getCategoryPath";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

export async function buildListingUrl(
  listing: ExtendedListing
): Promise<string> {
  try {
    const [mainCategory, subCategory, subSubCategory] = await getCategoryPath(
      listing.subcategory_id?.toString() || ""
    );
    return `/${mainCategory}/${subCategory}/${subSubCategory}/${listing.id}`;
  } catch (error) {
    console.error("Error building listing URL:", error);
    throw error;
  }
}

// utils/categoryUtils.ts
export const slugifyCategory = (category: string) => {
  return category
    .toLowerCase()
    .replace(/[&]/g, 'and')          // replace & with 'and'
    .replace(/[^a-z0-9]/g, '-')      // replace any non-alphanumeric with hyphen
    .replace(/-+/g, '-')             // replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '');          // remove leading/trailing hyphens
};

export const decodeCategorySlug = (slug: string) => {
  return slug
    .split('-')
    .map(word => word === 'and' ? '&' : word)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const getCategoryUrl = (mainCategory: string, subCategory?: string, subSubCategory?: string) => {
  const segments = [mainCategory, subCategory, subSubCategory]
    .filter((segment): segment is string => Boolean(segment))
    .map(slugifyCategory);
  
  return `/categories/${segments.join('/')}`;  // Added 'categories' prefix
};

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
