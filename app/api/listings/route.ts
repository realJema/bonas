// app/api/listings/route.ts
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

  // Use Set<bigint> instead of Set<number>
  const categoryIds = new Set<bigint>([mainCategoryRecord.id]);

  if (subCategory) {
    const subCategoryRecord = mainCategoryRecord.children.find(
      (child) => child.name.toLowerCase() === subCategory.toLowerCase()
    );

    if (subCategoryRecord) {
      categoryIds.add(subCategoryRecord.id);

      if (subSubCategory) {
        const subSubCategoryRecord = subCategoryRecord.children.find(
          (child) => child.name.toLowerCase() === subSubCategory.toLowerCase()
        );
        if (subSubCategoryRecord) {
          categoryIds.add(subSubCategoryRecord.id);
        }
      } else {
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

  const where: any = {
    subcategory_id: {
      in: Array.from(categoryIds), // No need to map to BigInt since they're already BigInt
    },
  };

  if (location) {
    where.town = {
      equals: location,
      mode: "insensitive",
    };
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
        timeline: true,
        deadline: true,
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
            profilImage: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings: listings.map((listing) => {
      // Handle images parsing
      let parsedImages = [];
      try {
        if (listing.images) {
          parsedImages =
            typeof listing.images === "string"
              ? JSON.parse(listing.images)
              : listing.images;
        }
      } catch (error) {
        console.error("Error parsing images for listing:", listing.id, error);
        parsedImages = [];
      }

      // Handle tags parsing
      let parsedTags = null;
      try {
        if (listing.tags) {
          parsedTags =
            typeof listing.tags === "string"
              ? JSON.parse(listing.tags)
              : listing.tags;
        }
      } catch (error) {
        console.error("Error parsing tags for listing:", listing.id, error);
        parsedTags = null;
      }

      // Handle final images
      const hasCoverImage = !!listing.cover_image;
      const hasListingImages = parsedImages.length > 0;

      return {
        id: listing.id.toString(),
        title: listing.title,
        description: listing.description,
        timeline: listing.timeline,
        deadline: listing.deadline,
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
        images: parsedImages,
        is_boosted: listing.is_boosted,
        is_boosted_type: listing.is_boosted_type,
        is_boosted_expiry_date: listing.is_boosted_expiry_date,
        expiry_date: listing.expiry_date?.toISOString() || null,
        tags: parsedTags,
        condition: listing.condition,
        negotiable: listing.negotiable?.toString() || null,
        delivery_available: listing.delivery_available?.toString() || null,
        rating: listing.rating,
        user: listing.user
          ? {
              id: listing.user.id,
              name: listing.user.name,
              username: listing.user.username,
              profilePicture: listing.user.profilePicture,
              profilImage: listing.user.profilImage,
              image: listing.user.image,
              email: listing.user.email,
              phoneNumber: listing.user.phoneNumber,
            }
          : null,
      };
    }),
    totalCount,
  };
}



// // app/api/listings/route.ts
// import { NextResponse } from "next/server";
// import prisma from "@/prisma/client";
// import { Decimal } from "@prisma/client/runtime/library.js";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";

// interface GetListingsParams {
//   mainCategory: string;
//   subCategory?: string;
//   subSubCategory?: string;
//   page: number;
//   pageSize: number;
//   location?: string;
//   minPrice?: Decimal;
//   maxPrice?: Decimal;
// }

// export const dynamic = "force-dynamic";

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const mainCategory = searchParams.get("mainCategory") || "";
//   const subCategory = searchParams.get("subCategory") || undefined;
//   const subSubCategory = searchParams.get("subSubCategory") || undefined;
//   const page = parseInt(searchParams.get("page") || "1", 10);
//   const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);
//   const location = searchParams.get("location") || undefined;
//   const minPrice = searchParams.get("minPrice")
//     ? new Decimal(searchParams.get("minPrice") as string)
//     : undefined;
//   const maxPrice = searchParams.get("maxPrice")
//     ? new Decimal(searchParams.get("maxPrice") as string)
//     : undefined;

//   try {
//     const { listings, totalCount } = await getListings({
//       mainCategory,
//       subCategory,
//       subSubCategory,
//       page,
//       pageSize,
//       location,
//       minPrice,
//       maxPrice,
//     });

//     return NextResponse.json({ listings, totalCount }, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching listings:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch listings" },
//       { status: 500 }
//     );
//   }
// }

// async function getListings({
//   mainCategory,
//   subCategory,
//   subSubCategory,
//   page,
//   pageSize,
//   location,
//   minPrice,
//   maxPrice,
// }: GetListingsParams): Promise<{
//   listings: ExtendedListing[];
//   totalCount: number;
// }> {
//   // Get category hierarchy in one query
//   const mainCategoryRecord = await prisma.category.findFirst({
//     where: {
//       name: { equals: mainCategory, mode: "insensitive" },
//       parentId: null,
//     },
//     include: {
//       children: {
//         include: {
//           children: true,
//         },
//       },
//     },
//   });

//   if (!mainCategoryRecord) {
//     return { listings: [], totalCount: 0 };
//   }

//   // Build category IDs array efficiently
//   const categoryIds = new Set<number>([mainCategoryRecord.id]);

//   if (subCategory) {
//     const subCategoryRecord = mainCategoryRecord.children.find(
//       (child) => child.name.toLowerCase() === subCategory.toLowerCase()
//     );

//     if (subCategoryRecord) {
//       if (subSubCategory) {
//         const subSubCategoryRecord = subCategoryRecord.children.find(
//           (child) => child.name.toLowerCase() === subSubCategory.toLowerCase()
//         );
//         if (subSubCategoryRecord) {
//           categoryIds.add(subSubCategoryRecord.id);
//         }
//       } else {
//         categoryIds.add(subCategoryRecord.id);
//         subCategoryRecord.children.forEach((child) =>
//           categoryIds.add(child.id)
//         );
//       }
//     }
//   } else {
//     mainCategoryRecord.children.forEach((subCat) => {
//       categoryIds.add(subCat.id);
//       subCat.children.forEach((subSubCat) => categoryIds.add(subSubCat.id));
//     });
//   }

//   const where: any = {
//     subcategory_id: {
//       in: Array.from(categoryIds).map((id) => BigInt(id)),
//     },
//   };

//   if (location) {
//     where.town = {
//       equals: location,
//       mode: "insensitive",
//     };
//   }

//   if (minPrice !== undefined) {
//     where.price = {
//       gte: minPrice,
//     };
//   }

//   if (maxPrice !== undefined) {
//     where.price = {
//       ...where.price,
//       lte: maxPrice,
//     };
//   }

//   const [listings, totalCount] = await prisma.$transaction([
//     prisma.listing.findMany({
//       where,
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//       orderBy: { created_at: "desc" },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         timeline: true,
//         subcategory_id: true,
//         price: true,
//         currency: true,
//         town: true,
//         address: true,
//         user_id: true,
//         created_at: true,
//         updated_at: true,
//         status: true,
//         views: true,
//         cover_image: true,
//         images: true,
//         is_boosted: true,
//         is_boosted_type: true,
//         is_boosted_expiry_date: true,
//         expiry_date: true,
//         tags: true,
//         condition: true,
//         negotiable: true,
//         delivery_available: true,
//         rating: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//             profilePicture: true,
//             profilImage: true,
//           },
//         },
//       },
//     }),
//     prisma.listing.count({ where }),
//   ]);

//   return {
//     listings: listings.map((listing) => {
//       // Safely parse images
//       let parsedImages = null;
//       try {
//         if (listing.images) {
//           if (typeof listing.images === "string") {
//             parsedImages = JSON.parse(listing.images);
//           } else {
//             parsedImages = listing.images;
//           }
//         }
//       } catch (error) {
//         console.error("Error parsing images for listing:", listing.id, error);
//         parsedImages = [];
//       }

//       // Safely parse tags
//       let parsedTags = null;
//       try {
//         if (listing.tags) {
//           if (typeof listing.tags === "string") {
//             parsedTags = JSON.parse(listing.tags);
//           } else {
//             parsedTags = listing.tags;
//           }
//         }
//       } catch (error) {
//         console.error("Error parsing tags for listing:", listing.id, error);
//         parsedTags = [];
//       }

//       return {
//         id: listing.id.toString(),
//         title: listing.title,
//         description: listing.description,
//         timeline: listing.timeline,
//         subcategory_id: listing.subcategory_id?.toString() || null,
//         price: listing.price?.toString() || null,
//         currency: listing.currency,
//         town: listing.town,
//         address: listing.address,
//         user_id: listing.user_id,
//         created_at: listing.created_at?.toISOString() || null,
//         updated_at: listing.updated_at?.toISOString() || null,
//         status: listing.status,
//         views: listing.views,
//         cover_image: listing.cover_image,
//         images: parsedImages,
//         is_boosted: listing.is_boosted,
//         is_boosted_type: listing.is_boosted_type,
//         is_boosted_expiry_date: listing.is_boosted_expiry_date,
//         expiry_date: listing.expiry_date?.toISOString() || null,
//         tags: parsedTags,
//         condition: listing.condition,
//         negotiable: listing.negotiable?.toString() || null,
//         delivery_available: listing.delivery_available?.toString() || null,
//         rating: listing.rating,
//         user: listing.user
//           ? {
//               id: listing.user.id,
//               name: listing.user.name,
//               username: listing.user.username,
//               profilePicture: listing.user.profilePicture,
//               profilImage: listing.user.profilImage,
//               image: listing.user.image,
//             }
//           : null,
//       };
//     }),
//     totalCount,
//   };
// }
