import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "./imageUtils";

export function formatListings(listings: any[]): ExtendedListing[] {
   return listings.map((listing): ExtendedListing => {
     // Handle images with better fallback logic
     let parsedImages = [];
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

     // Ensure we always have at least one image
     const finalImages =
       parsedImages.length > 0 ? parsedImages : [DEFAULT_IMAGE];

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
       cover_image: listing.cover_image || DEFAULT_IMAGE.imageUrl,
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
       user: listing.user
         ? {
             id: listing.user.id || "",
             name: listing.user.name || null,
             username: listing.user.username || null,
             profilePicture: listing.user.profilePicture || null,
             profilImage: listing.user.profilImage || null,
             image: listing.user.image || null,
           }
         : null,
     };
   });
}
