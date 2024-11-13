import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "./imageUtils";

export function formatListings(listings: any[]): ExtendedListing[] {
  return listings.map((listing): ExtendedListing => {
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
        : [{ imageUrl: DEFAULT_IMAGE }];

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
      user: {
        id: listing.user?.id || "",
        name: listing.user?.name || null,
        username: listing.user?.username || null,
        profilePicture: listing.user?.profilePicture || null,
      },
    };
  });
}