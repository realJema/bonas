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

/**  */

export const getCategoryUrl = (category: string) => {
  const encodedCategory = encodeURIComponent(category);
  return `/categories/${encodedCategory}`;
};
