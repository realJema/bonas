interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  
}

/**
 * Gets the subcategory name for a listing based on its category
 * @param categories - Array of all categories
 * @param listingCategory - The listing's direct category
 * @returns The subcategory name if the listing's category is a subcategory, or undefined
 */
export const getListingSubcategory = (
  categories: Category[],
  listingCategory: Category
): string | undefined => {
  // If the listing's category has a parentId, it's a subcategory
  if (listingCategory.parentId) {
    // Find the parent category
    const parentCategory = categories.find(cat => cat.id === listingCategory.parentId);
    
    // If parent category exists and it also has a parentId, then listingCategory is a sub-subcategory
    // In this case, we need to find the subcategory
    if (parentCategory?.parentId) {
      return parentCategory.name;
    }
    
    // If parent category exists but has no parentId, then listingCategory is a subcategory
    return listingCategory.name;
  }
  
  return undefined;
}