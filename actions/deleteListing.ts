"use server";

import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Define deletion schema for validation
const DeleteListingSchema = z.object({
  listingId: z.number().positive(),
  username: z.string().min(1),
});

// 2. Define return type for better type safety
type DeleteListingResult =
  | { success: true }
  | { success: false; error: string };

// 3. Main server action for deleting listings
export async function deleteListing(
  listingId: number,
  username: string
): Promise<DeleteListingResult> {
  try {
    // 4. Validate input data
    const validated = DeleteListingSchema.parse({ listingId, username });

    // 5. Get authenticated session
    const session = await auth();
    if (!session?.user?.email) {
      return {
        success: false,
        error: "Authentication required",
      };
    }

    // 6. Get authenticated user from database
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

    // 7. Check if listing exists and belongs to user
    const listing = await prisma.listing.findUnique({
      where: { id: validated.listingId },
      select: {
        id: true,
        userId: true,
        images: { select: { id: true } },
        reviews: { select: { id: true } },
      },
    });

    if (!listing) {
      return {
        success: false,
        error: "Listing not found",
      };
    }

    if (listing.userId !== user.id) {
      return {
        success: false,
        error: "Unauthorized to delete this listing",
      };
    }

    // 8. Delete listing and related data in a transaction
    await prisma.$transaction(async (tx) => {
      // 8.1 Delete images
      if (listing.images.length > 0) {
        await tx.image.deleteMany({
          where: { listingId: listing.id },
        });
      }

      // 8.2 Delete reviews
      if (listing.reviews.length > 0) {
        await tx.review.deleteMany({
          where: { listingId: listing.id },
        });
      }

      // 8.3 Delete the listing
      await tx.listing.delete({
        where: { id: listing.id },
      });
    });

    // 9. Revalidate relevant paths
    revalidatePath(`/profile/user-dashboard/${validated.username}`);
    revalidatePath("/listings"); // Revalidate main listings page if exists
    revalidatePath(`/listings/${listing.id}`); // Revalidate listing detail page

    return { success: true };
  } catch (error) {
    console.error("Error in deleteListing action:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    return {
      success: false,
      error: "Failed to delete listing",
    };
  }
}
