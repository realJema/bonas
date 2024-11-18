// app/api/listings/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";
import { formatListings } from "@/utils/formatListings";

// Helper function to build category filter
async function buildCategoryFilter(
  mainCategory: string | null,
  subCategory: string | null,
  subSubCategory: string | null
) {
  if (!mainCategory) return null;

  // Get main category
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

  if (!mainCategoryRecord) return null;

  // Build category IDs array
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

  return {
    subcategory_id: {
      in: Array.from(categoryIds).map((id) => BigInt(id)),
    },
  };
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get("searchTerm");
    const mainCategory = searchParams.get("mainCategory");
    const subCategory = searchParams.get("subCategory");
    const subSubCategory = searchParams.get("subSubCategory");

    // Early return if search term is too short
    if (!searchTerm || searchTerm.length < 2) {
      return NextResponse.json({ listings: [], totalCount: 0 });
    }

    // Optimized where clause
    const whereClause: any = {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          tags: {
            array_contains: searchTerm.toLowerCase(),
          },
        },
      ],
      // Only show active listings
      status: "active",
    };

    // Add category filters if provided
    if (mainCategory || subCategory || subSubCategory) {
      const categoryWhere = await buildCategoryFilter(
        mainCategory,
        subCategory,
        subSubCategory
      );
      if (categoryWhere) {
        whereClause.AND = [categoryWhere];
      }
    }

    // Optimized transaction with selective fields
    const [listings, totalCount] = await prisma.$transaction([
      prisma.listing.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          currency: true,
          cover_image: true,
          images: true,
          status: true,
          subcategory_id: true,
          created_at: true,
          is_boosted: true,
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
            },
          },
        },
        take: 8, // Reduced number of results for better performance
        orderBy: [{ is_boosted: "desc" }, { created_at: "desc" }],
      }),
      prisma.listing.count({ where: whereClause }),
    ]);

    const formattedListings = formatListings(listings);

    return NextResponse.json({
      listings: formattedListings,
      totalCount,
      hasMore: listings.length === 8,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search listings" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
