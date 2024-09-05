import prisma from "@/prisma/client";

export async function getCategories(mainCategoryName: string) {
  const mainCategory = await prisma.category.findFirst({
    where: {
      name: { contains: mainCategoryName, mode: "insensitive" },
      parentId: null,
    },
    include: {
      children: true,
    },
  });

  if (!mainCategory) {
    console.error(`Main category "${mainCategoryName}" not found.`);
    return [];
  }

  return mainCategory.children.map((subCategory) => ({
    title: subCategory.name,
    href: `/categories/${mainCategoryName.toLowerCase()}/${subCategory.name
      .toLowerCase()
      .replace(/ /g, "-")}`,
    items: subCategory.description
      ? subCategory.description.split(", ").map((item) => ({
          name: item,
          href: `/categories/${mainCategoryName.toLowerCase()}/${subCategory.name
            .toLowerCase()
            .replace(/ /g, "-")}/${item.toLowerCase().replace(/ /g, "-")}`,
        }))
      : [],
  }));
}
