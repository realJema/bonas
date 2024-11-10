// utils/getListings.ts
import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";



export const maxDuration = 60;

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

function getDateFilter(datePosted: string): Date {
  const now = new Date();
  const filterDate = new Date(now);

  switch (datePosted) {
    case "24h":
      filterDate.setHours(now.getHours() - 24);
      break;
    case "7d":
      filterDate.setDate(now.getDate() - 7);
      break;
    case "14d":
      filterDate.setDate(now.getDate() -14);
      break;
    case "30d":
      filterDate.setDate(now.getDate() - 30);
      break;
    default:
      return new Date(0);
  }
  return filterDate;
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
  try {
    // Get category hierarchy in one query
    const mainCategoryRecord = await prisma.category.findFirst({
      where: {
        name: { equals: mainCategory, mode: "insensitive" },
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
      return { listings: [], totalCount: 0 };
    }

    // Build category IDs array efficiently
    const categoryIds = new Set<number>([mainCategoryRecord.id]);

    if (subCategory) {
      const subCategoryRecord = mainCategoryRecord.children.find(
        (child) => child.name.toLowerCase() === subCategory.toLowerCase()
      );

      if (subCategoryRecord) {
        if (subSubCategory) {
          const subSubCategoryRecord = subCategoryRecord.children.find(
            (child) => child.name.toLowerCase() === subSubCategory.toLowerCase()
          );
          if (subSubCategoryRecord) {
            categoryIds.add(subSubCategoryRecord.id);
          }
        } else {
          categoryIds.add(subCategoryRecord.id);
          subCategoryRecord.children.forEach((child) =>
            categoryIds.add(child.id)
          );
        }
      }
    } else {
      mainCategoryRecord.children.forEach((subCat) => {
        categoryIds.add(subCat.id);
        subCat.children.forEach((subSubCat) => categoryIds.add(subSubCat.id));
      });
    }

    const whereClause: any = {
      subcategory_id: {
        in: Array.from(categoryIds).map((id) => BigInt(id)), // Convert to BigInt
      },
    };

    if (location) {
      whereClause.town = {
        equals: location,
        mode: "insensitive",
      };
    }

    if (datePosted) {
      const filterDate = getDateFilter(datePosted);
      whereClause.created_at = {
        gte: filterDate,
        lte: new Date(),
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.price = {};
      if (minPrice !== undefined) whereClause.price.gte = minPrice;
      if (maxPrice !== undefined) whereClause.price.lte = maxPrice;
    }

    // Optimized query with specific field selection
    const [listings, totalCount] = await prisma.$transaction([
      prisma.listing.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              profilePicture: true,
            },
          },
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { created_at: "desc" },
      }),
      prisma.listing.count({ where: whereClause }),
    ]);

    return {
      listings: listings.map((listing): ExtendedListing => {
        // Parse images with fallback to default
        let parsedImages = null;
        try {
          parsedImages = listing.images
            ? JSON.parse(listing.images as string)
            : null;
        } catch (e) {
          console.error("Error parsing images:", e);
          parsedImages = null;
        }

        // Use default image if no images or empty array
        const finalImages =
          parsedImages && Array.isArray(parsedImages) && parsedImages.length > 0
            ? parsedImages
            : [DEFAULT_IMAGE];

        return {
          id: listing.id.toString(),
          title: listing.title,
          description: listing.description,
          subcategory_id: listing.subcategory_id?.toString() || null,
          price: listing.price?.toString() || null,
          currency: listing.currency,
          town: listing.town,
          address: listing.address,
          user_id: listing.user_id,
          created_at: listing.created_at?.toISOString() || null,
          updated_at: listing.updated_at?.toISOString() || null,
          status: listing.status,
          views: listing.views,
          cover_image: listing.cover_image,
          images: finalImages,
          is_boosted: listing.is_boosted,
          is_boosted_type: listing.is_boosted_type,
          is_boosted_expiry_date: listing.is_boosted_expiry_date,
          expiry_date: listing.expiry_date?.toISOString() || null,
          tags: listing.tags ? JSON.parse(listing.tags as string) : null,
          condition: listing.condition,
          negotiable: listing.negotiable?.toString() || null,
          delivery_available: listing.delivery_available?.toString() || null,
          rating: listing.rating,
          user: listing.user,
        };
      }),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], totalCount: 0 };
  }
}