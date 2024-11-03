// imageUtils
import { Image as PrismaImage } from "@prisma/client";

export const DEFAULT_IMAGE: PrismaImage = {
  id: -1,
  imageUrl:
    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
  listingId: -1,
  createdAt: new Date(),
};

export const isValidCloudinaryUrl = (url: string) => {
  return url.startsWith("https://res.cloudinary.com/") || url === DEFAULT_IMAGE.imageUrl;
};

export const processListingImages = (images: string[]): string[] => {
  if (!images || images.length === 0) {
    return [DEFAULT_IMAGE.imageUrl];
  }
  
  const realImages = images.filter(url => url !== DEFAULT_IMAGE.imageUrl);
  return realImages.length > 0 ? realImages : [DEFAULT_IMAGE.imageUrl];
};