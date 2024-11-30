import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { DEFAULT_IMAGE } from "@/utils/imageUtils";

export interface Slide {
  type: "image" | "video";
  url: string;
}

export const generateSlides = (listing: ExtendedListing): Slide[] => {
  const defaultSlide: Slide = {
    type: "image",
    url: DEFAULT_IMAGE.imageUrl,
  };

  if (!listing.images && !listing.cover_image) {
    // Return default image if no images and cover image are available
    return [defaultSlide];
  }

  const slides: Slide[] = [];

  // Add cover image as the first slide if available
  if (listing.cover_image) {
    slides.push({
      type: "image",
      url: listing.cover_image,
    });
  }

  // Parse and add other images to the slides array
  if (listing.images) {
    const parsedImages = Array.isArray(listing.images)
      ? listing.images
      : typeof listing.images === "string"
      ? JSON.parse(listing.images)
      : [];

    parsedImages.forEach((image: any) => {
      const imageUrl =
        typeof image === "string"
          ? image
          : image.imageUrl || image.url || DEFAULT_IMAGE.imageUrl;

      // Skip the cover image if it's already added as the first slide
      if (imageUrl !== listing.cover_image) {
        slides.push({
          type: "image",
          url: imageUrl,
        });
      }
    });
  }

  // If no slides are added, return the default slide
  if (slides.length === 0) {
    return [defaultSlide];
  }

  return slides;
};
