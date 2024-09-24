import { Category } from "@prisma/client";

type CategoryWithChildren = Category & {
  children?: CategoryWithChildren[];
  parent?: CategoryWithChildren;
};

export const getCategoryPath = (
  category: CategoryWithChildren,
  selectedSubCategory?: string,
  selectedSubSubCategory?: string
): string[] => {
  const path: string[] = [];
  let currentCategory: CategoryWithChildren | undefined = category;

  // Find the main category by traversing up the tree
  while (currentCategory?.parent) {
    currentCategory = currentCategory.parent;
  }

  // Add the main category
  if (currentCategory) {
    path.push(currentCategory.name.toLowerCase());
  }

  // Add the selected subcategory if provided, otherwise use the original category
  if (selectedSubCategory) {
    path.push(selectedSubCategory.toLowerCase());
  } else if (category.parent) {
    path.push(category.name.toLowerCase());
  } else {
    path.push(path[0] || "");
  }

  // Add the selected sub-subcategory if provided, otherwise use the first item from description
  if (selectedSubSubCategory) {
    path.push(selectedSubSubCategory.toLowerCase());
  } else if (category.description) {
    const subSubCategories = category.description.split(", ");
    if (subSubCategories.length > 0) {
      path.push(subSubCategories[0].toLowerCase());
    } else {
      path.push(path[1] || "");
    }
  } else {
    path.push(path[1] || "");
  }

  return path.slice(0, 3); // Ensure we only return three levels
};

export const buildListingUrl = (listing: {
  id: string | number;
  category: CategoryWithChildren;
  selectedSubCategory?: string;
  selectedSubSubCategory?: string;
}): string => {
  const [mainCategory, subCategory, subSubCategory] = getCategoryPath(
    listing.category,
    listing.selectedSubCategory,
    listing.selectedSubSubCategory
  );

  return `/${encodeURIComponent(mainCategory)}/${encodeURIComponent(
    subCategory
  )}/${encodeURIComponent(subSubCategory)}/${listing.id}`;
};
