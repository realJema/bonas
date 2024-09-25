import { ExtendedListing } from "@/app/entities/ExtendedListing";

export const generateSlides = (listing: ExtendedListing) => {
  return listing.images.map((image) => ({
    type: "image" as const,
    url: image.imageUrl,
  }));
};
