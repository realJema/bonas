import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "./imageUtils";

export function formatListings(listings: any[]): ExtendedListing[] {
  return listings.map((listing): ExtendedListing => {
    // Handle images with better fallback logic
    let parsedImages: Array<{ imageUrl: string }> = [];
    try {
      if (listing.images) {
        if (typeof listing.images === "string") {
          parsedImages = JSON.parse(listing.images);
        } else if (Array.isArray(listing.images)) {
          parsedImages = listing.images;
        }
      }
    } catch (e) {
      console.error("Error parsing images for listing:", listing.id, e);
      parsedImages = [];
    }

    // Handle tags parsing
    let parsedTags: string[] | null = null;
    try {
      if (listing.tags) {
        parsedTags =
          typeof listing.tags === "string"
            ? JSON.parse(listing.tags)
            : listing.tags;
      }
    } catch (e) {
      console.error("Error parsing tags for listing:", listing.id, e);
      parsedTags = null;
    }

    // Only use DEFAULT_IMAGE if there's no cover image AND no listing images
    const hasCoverImage = !!listing.cover_image;
    const hasListingImages = parsedImages.length > 0;

    const finalImages = hasListingImages
      ? parsedImages
      : hasCoverImage
      ? []
      : [DEFAULT_IMAGE];

    const finalCoverImage = hasCoverImage
      ? listing.cover_image
      : hasListingImages
      ? parsedImages[0].imageUrl
      : DEFAULT_IMAGE.imageUrl;

    return {
      id: listing.id.toString(),
      title: listing.title || null,
      description: listing.description || null,
      deadline: listing.deadline || null,
      timeline: listing.timeline || null,
      subcategory_id: listing.subcategory_id?.toString() || null,
      price: listing.price?.toString() || null,
      currency: listing.currency || null,
      town: listing.town || null,
      address: listing.address || null,
      user_id: listing.user_id || null,
      created_at: listing.created_at?.toISOString() || null,
      updated_at: listing.updated_at?.toISOString() || null,
      status: listing.status || null,
      views: listing.views || null,
      cover_image: finalCoverImage || null,
      images: finalImages || null,
      is_boosted: listing.is_boosted || null,
      is_boosted_type: listing.is_boosted_type || null,
      is_boosted_expiry_date: listing.is_boosted_expiry_date || null,
      expiry_date: listing.expiry_date?.toISOString() || null,
      tags: parsedTags,
      condition: listing.condition || null,
      negotiable: listing.negotiable?.toString() || null,
      delivery_available: listing.delivery_available?.toString() || null,
      rating: listing.rating || null,
      user: listing.user
        ? {
            id: listing.user.id?.toString() || "",
            name: listing.user.name || null,
            username: listing.user.username || null,
            profilePicture: listing.user.profilePicture || null,
            profilImage: listing.user.profilImage || null,
            image: listing.user.image || null,
            email: listing.user.email || null,
            phoneNumber: listing.user.phoneNumber || null,
          }
        : null,
    };
  });
}
