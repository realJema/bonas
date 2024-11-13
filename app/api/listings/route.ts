import { NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { Decimal } from "@prisma/client/runtime/library.js";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

interface GetListingsParams {
  mainCategory: string;
  subCategory?: string;
  subSubCategory?: string;
  page: number;
  pageSize: number;
  location?: string;
  minPrice?: Decimal;
  maxPrice?: Decimal;
}

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mainCategory = searchParams.get("mainCategory") || "";
  const subCategory = searchParams.get("subCategory") || undefined;
  const subSubCategory = searchParams.get("subSubCategory") || undefined;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
  const location = searchParams.get("location") || undefined;
  const minPrice = searchParams.get("minPrice")
    ? new Decimal(searchParams.get("minPrice") as string)
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? new Decimal(searchParams.get("maxPrice") as string)
    : undefined;

  try {
    const { listings, totalCount } = await getListings({
      mainCategory,
      subCategory,
      subSubCategory,
      page,
      pageSize,
      location,
      minPrice,
      maxPrice,
    });

    return NextResponse.json({ listings, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

async function getListings({
  mainCategory,
  subCategory,
  subSubCategory,
  page,
  pageSize,
  location,
  minPrice,
  maxPrice,
}: GetListingsParams): Promise<{
  listings: ExtendedListing[];
  totalCount: number;
}> {
  const mainCategoryRecord = await prisma.category.findFirst({
    where: {
      name: mainCategory,
      parentId: null,
    },
  });

  if (!mainCategoryRecord) {
    return { listings: [], totalCount: 0 };
  }

  const categoryIds = [mainCategoryRecord.id];

  if (subCategory) {
    const subCategoryRecord = await prisma.category.findFirst({
      where: {
        name: subCategory,
        parentId: mainCategoryRecord.id,
      },
    });

    if (subCategoryRecord) {
      categoryIds.push(subCategoryRecord.id);

      if (subSubCategory) {
        const subSubCategoryRecord = await prisma.category.findFirst({
          where: {
            name: subSubCategory,
            parentId: subCategoryRecord.id,
          },
        });

        if (subSubCategoryRecord) {
          categoryIds.push(subSubCategoryRecord.id);
        }
      }
    }
  }

  const where: any = {
    subcategory_id: {
      in: categoryIds,
    },
  };

  if (location) {
    where.town = location;
  }

  if (minPrice !== undefined) {
    where.price = {
      gte: minPrice,
    };
  }

  if (maxPrice !== undefined) {
    where.price = {
      ...where.price,
      lte: maxPrice,
    };
  }

  const [listings, totalCount] = await prisma.$transaction([
    prisma.listing.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        subcategory_id: true,
        price: true,
        currency: true,
        town: true,
        address: true,
        user_id: true,
        created_at: true,
        updated_at: true,
        status: true,
        views: true,
        cover_image: true,
        images: true,
        is_boosted: true,
        is_boosted_type: true,
        is_boosted_expiry_date: true,
        expiry_date: true,
        tags: true,
        condition: true,
        negotiable: true,
        delivery_available: true,
        rating: true,
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
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings: listings.map((listing) => ({
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
      images: listing.images ? JSON.parse(listing.images as string) : null,
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
    })),
    totalCount,
  };
}
