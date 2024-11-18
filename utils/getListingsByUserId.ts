import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";

interface GetListingsByUserIdParams {
  userId: string;
  page: number;
  pageSize: number;
}

interface GetListingsByUserIdResult {
  listings: ExtendedListing[];
  totalCount: number;
}

export async function getListingsByUserId({
  userId,
  page,
  pageSize,
}: GetListingsByUserIdParams): Promise<GetListingsByUserIdResult> {
  try {
    const whereClause = {
      user_id: userId,
    };

    const [listings, totalCount] = await prisma.$transaction([
      prisma.listing.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          timeline: true,
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
      listings: listings.map((listing) => {
        // Parse images
        let parsedImages = null;
        try {
          if (listing.images) {
            parsedImages =
              typeof listing.images === "string"
                ? JSON.parse(listing.images)
                : listing.images;
          }
        } catch (error) {
          console.error("Error parsing images for listing:", listing.id, error);
          parsedImages = [DEFAULT_IMAGE];
        }

        // Parse tags
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
          parsedTags = [];
        }

        return {
          id: listing.id.toString(),
          title: listing.title,
          description: listing.description,
          timeline: listing.timeline,
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
          images: parsedImages || [DEFAULT_IMAGE],
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
              }
            : null,
        };
      }),
      totalCount,
    };
  } catch (error) {
    console.error("Error fetching listings by user ID:", error);
    return { listings: [], totalCount: 0 };
  }
}
