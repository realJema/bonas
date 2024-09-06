import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

interface GetListingsParams {
  mainCategory: string;
  subCategory: string;
  page: number;
  pageSize: number;
}

interface GetListingsResult {
  listings: ExtendedListing[];
  totalCount: number;
}

export async function getListings({
  mainCategory,
  subCategory,
  page,
  pageSize,
}: GetListingsParams): Promise<GetListingsResult> {
  "use server";

  try {
    console.log(
      `Searching for main category: "${mainCategory}", sub-category: "${subCategory}"`
    );

    // Find the main category (case-insensitive, partial match)
    const mainCategoryRecord = await prisma.category.findFirst({
      where: {
        name: { contains: mainCategory, mode: "insensitive" },
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
      console.error(`Main category "${mainCategory}" not found.`);
      return { listings: [], totalCount: 0 };
    }

    console.log(`Found main category: ${mainCategoryRecord.name}`);

    let categoryIds: number[] = [mainCategoryRecord.id];

    // If subcategory is provided, find it within the main category's children or grandchildren
    if (subCategory) {
      const subCategoryRecord = await prisma.category.findFirst({
        where: {
          OR: [
            { id: { in: mainCategoryRecord.children.map((c) => c.id) } },
            {
              id: {
                in: mainCategoryRecord.children.flatMap((c) =>
                  c.children.map((gc) => gc.id)
                ),
              },
            },
          ],
          name: { contains: subCategory, mode: "insensitive" },
        },
      });

      if (!subCategoryRecord) {
        console.error(
          `Sub-category "${subCategory}" not found under "${mainCategory}". Falling back to main category.`
        );
        // Fall back to using the main category
        categoryIds = [
          mainCategoryRecord.id,
          ...mainCategoryRecord.children.map((c) => c.id),
          ...mainCategoryRecord.children.flatMap((c) =>
            c.children.map((gc) => gc.id)
          ),
        ];
      } else {
        console.log(`Found sub-category: ${subCategoryRecord.name}`);
        categoryIds = [subCategoryRecord.id];

        // Include child categories if the found category is a subcategory
        const childCategories = await prisma.category.findMany({
          where: { parentId: subCategoryRecord.id },
        });
        categoryIds = [...categoryIds, ...childCategories.map((c) => c.id)];
      }
    } else {
      // If no subcategory, include all children and grandchildren
      const allSubcategories = await prisma.category.findMany({
        where: {
          OR: [
            { parentId: mainCategoryRecord.id },
            { parent: { parentId: mainCategoryRecord.id } },
          ],
        },
      });
      categoryIds = [...categoryIds, ...allSubcategories.map((c) => c.id)];
    }

    console.log(
      `Searching for listings in categories: ${categoryIds.join(", ")}`
    );

    // Fetch listings and total count in parallel
    const [listings, totalCount] = await Promise.all([
      prisma.listing.findMany({
        where: {
          categoryId: {
            in: categoryIds,
          },
        },
        include: {
          category: true,
          user: true,
          images: true,
          reviews: true,
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.listing.count({
        where: {
          categoryId: {
            in: categoryIds,
          },
        },
      }),
    ]);

    console.log(`Found ${listings.length} listings out of ${totalCount} total`);

    return {
      listings: listings.map(
        (listing): ExtendedListing => ({
          ...listing,
          price: listing.price?.toFixed(2) ?? "0.00",
        })
      ),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalCount: 0 };
  }
}
