"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Define deletion schema
const DeleteListingSchema = z.object({
  listingId: z
    .string()
    .or(z.number())
    .transform((val) => BigInt(val)),
  username: z.string().min(1),
});

// Define return type
type DeleteListingResult = {
  success: boolean;
  error?: string;
  message?: string;
};

// Helper function to delete image from Cloudinary
async function deleteCloudinaryImage(url: string) {
  try {
    // Extract public_id from Cloudinary URL
    const publicId = url.split("/").slice(-1)[0].split(".")[0];

    await cloudinary.uploader.destroy(`Listings/${publicId}`);
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    // Don't throw error as this is not critical
  }
}

export async function deleteListing(
  listingId: string | number,
  username: string
): Promise<DeleteListingResult> {
  try {
    // 1. Validate input
    const validated = DeleteListingSchema.parse({ listingId, username });

    // 2. Auth check
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // 3. Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    // 4. Get listing with all related data
    const listing = await prisma.listing.findUnique({
      where: { id: validated.listingId },
      select: {
        id: true,
        user_id: true,
        cover_image: true,
        images: true,
      },
    });

    if (!listing) {
      return {
        success: false,
        error: "Listing not found",
      };
    }

    if (listing.user_id !== user.id) {
      return {
        success: false,
        error: "Unauthorized to delete this listing",
      };
    }

    // 5. Delete listing and cleanup in transaction
    await prisma.$transaction(async (tx) => {
      // Delete the listing first
      await tx.listing.delete({
        where: { id: validated.listingId },
      });

      // Cleanup images from Cloudinary after successful DB deletion
      const imagesToDelete = [];

      // Add cover image if exists
      if (listing.cover_image) {
        imagesToDelete.push(listing.cover_image);
      }

      // Add additional images if they exist
      const additionalImages = listing.images as string[] | null;
      if (additionalImages) {
        imagesToDelete.push(...additionalImages);
      }

      // Delete all images from Cloudinary in parallel
      await Promise.allSettled(
        imagesToDelete.map((url) => deleteCloudinaryImage(url))
      );
    });

    revalidatePath("/"); // Home page
    revalidatePath("/profile/user-dashboard/[username]", "page");
    revalidatePath(`/profile/user-dashboard/${username}`);
    // revalidatePath(`/profile/user-dashboard/${username}/listings`);
    revalidateTag("listings");

    return {
      success: true,
      message: "Listing successfully deleted",
    };
  } catch (error) {
    console.error("Error in deleteListing:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error:
          "Invalid input data: " +
          error.errors.map((e) => e.message).join(", "),
      };
    }

    return {
      success: false,
      error: "Failed to delete listing",
    };
  }
}
