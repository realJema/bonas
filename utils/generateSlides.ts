import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";


export interface Slide {
  type: "image" | "video";
  url: string;
}

export const generateSlides = (listing: ExtendedListing): Slide[] => {
  if (
    !listing.images ||
    (Array.isArray(listing.images) && listing.images.length === 0)
  ) {
    // Return default image if no images are available
    return [
      {
        type: "image" as const,
        url: DEFAULT_IMAGE.imageUrl,
      },
    ];
  }

  const parsedImages = Array.isArray(listing.images)
    ? listing.images
    : typeof listing.images === "string"
    ? JSON.parse(listing.images)
    : [];

  // If parsed images is empty, return default image
  if (parsedImages.length === 0) {
    return [
      {
        type: "image" as const,
        url: DEFAULT_IMAGE.imageUrl,
      },
    ];
  }

  return parsedImages.map((image: any) => ({
    type: "image" as const,
    url:
      typeof image === "string"
        ? image
        : image.imageUrl || image.url || DEFAULT_IMAGE.imageUrl,
  }));
};
