// app/actions/categoryActions.ts
"use server";

import prisma from "@/prisma/client";

export async function getCategoryPath(
  subcategoryId: string
): Promise<string[]> {
  if (!subcategoryId) {
    throw new Error("Listing must have a subcategory_id");
  }

  // Get the category with its complete hierarchy
  const category = await prisma.category.findFirst({
    where: {
      id: Number(subcategoryId),
    },
    include: {
      parent: {
        include: {
          parent: true,
        },
      },
    },
  });

  if (!category) {
    throw new Error(`Category not found for subcategory_id: ${subcategoryId}`);
  }

  let mainCategory = "";
  let subCategory = "";
  let subSubCategory = "";

  // The current category is the sub-sub category
  subSubCategory = category.name.toLowerCase().replace(/\s+/g, "-");

  if (category.parent) {
    // The parent is the sub category
    subCategory = category.parent.name.toLowerCase().replace(/\s+/g, "-");

    if (category.parent.parent) {
      // The parent's parent is the main category
      mainCategory = category.parent.parent.name
        .toLowerCase()
        .replace(/\s+/g, "-");
    }
  }

  if (!mainCategory || !subCategory || !subSubCategory) {
    throw new Error(
      `Incomplete category hierarchy for subcategory_id: ${subcategoryId}`
    );
  }

  return [mainCategory, subCategory, subSubCategory];
}
