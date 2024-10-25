import { Category } from "@prisma/client";

type CategoryWithParent = Category & {
  parent?: CategoryWithParent;
};

/**
 * Gets the full category path from the category hierarchy
 */
export const getCategoryPath = (category: CategoryWithParent): string[] => {
  const path: string[] = [];
  let currentCategory: CategoryWithParent | undefined = category;

  // Build the path from bottom up
  while (currentCategory) {
    path.unshift(currentCategory.name.toLowerCase());
    currentCategory = currentCategory.parent;
  }

  // Ensure we have exactly three levels by padding with the last known category
  while (path.length < 3) {
    path.push(path[path.length - 1] || "");
  }

  // Ensure we only return three levels
  return path.slice(0, 3);
};

/**
 * Builds the complete URL for a listing
 */
export const buildListingUrl = (listing: {
  id: string | number;
  category: CategoryWithParent;
}): string => {
  const categoryPath = getCategoryPath(listing.category);

  return `/${categoryPath.map(encodeURIComponent).join("/")}/${listing.id}`;
};

/**
 * Helper function to validate if a listing URL matches its category hierarchy
 */
export const validateListingUrl = (
  listing: {
    id: string | number;
    category: CategoryWithParent;
  },
  mainCategory: string,
  subCategory: string,
  subSubCategory: string
): boolean => {
  const [expectedMain, expectedSub, expectedSubSub] = getCategoryPath(
    listing.category
  );

  return (
    expectedMain === mainCategory.toLowerCase() &&
    expectedSub === subCategory.toLowerCase() &&
    expectedSubSub === subSubCategory.toLowerCase()
  );
};

// import { Category } from "@prisma/client";

// type CategoryWithChildren = Category & {
//   children?: CategoryWithChildren[];
//   parent?: CategoryWithChildren;
// };

// export const getCategoryPath = (
//   category: CategoryWithChildren,
//   selectedSubCategory?: string,
//   selectedSubSubCategory?: string
// ): string[] => {
//   const path: string[] = [];
//   let currentCategory: CategoryWithChildren | undefined = category;

//   // Find the main category by traversing up the tree
//   while (currentCategory?.parent) {
//     currentCategory = currentCategory.parent;
//   }

//   // Add the main category
//   if (currentCategory) {
//     path.push(currentCategory.name.toLowerCase());
//   }

//   // Add the selected subcategory if provided, otherwise use the original category
//   if (selectedSubCategory) {
//     path.push(selectedSubCategory.toLowerCase());
//   } else if (category.parent) {
//     path.push(category.name.toLowerCase());
//   } else {
//     path.push(path[0] || "");
//   }

//   // Add the selected sub-subcategory if provided, otherwise use the first item from description
//   if (selectedSubSubCategory) {
//     path.push(selectedSubSubCategory.toLowerCase());
//   } else if (category.description) {
//     const subSubCategories = category.description.split(", ");
//     if (subSubCategories.length > 0) {
//       path.push(subSubCategories[0].toLowerCase());
//     } else {
//       path.push(path[1] || "");
//     }
//   } else {
//     path.push(path[1] || "");
//   }

//   return path.slice(0, 3); // Ensure we only return three levels
// };

// export const buildListingUrl = (listing: {
//   id: string | number;
//   category: CategoryWithChildren;
//   selectedSubCategory?: string;
//   selectedSubSubCategory?: string;
// }): string => {
//   const [mainCategory, subCategory, subSubCategory] = getCategoryPath(
//     listing.category,
//     listing.selectedSubCategory,
//     listing.selectedSubSubCategory
//   );

//   return `/${encodeURIComponent(mainCategory)}/${encodeURIComponent(
//     subCategory
//   )}/${encodeURIComponent(subSubCategory)}/${listing.id}`;
// };
