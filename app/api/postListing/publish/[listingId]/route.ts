// app/api/postListing/publish/[listingId]/route.ts
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

// Helper function to serialize the listing to match ExtendedListing type
function serializeListing(listing: any): ExtendedListing {
  return {
    id: listing.id.toString(),
    title: listing.title,
    description: listing.description,
    subcategory_id: listing.subcategory_id?.toString() || null,
    price: listing.price?.toString() || null,
    currency: listing.currency || null,
    timeline: listing.timeline || null,
    town: listing.town || null,
    address: listing.address || null,
    user_id: listing.user_id?.toString() || null,
    created_at: listing.created_at?.toISOString() || null,
    updated_at: listing.updated_at?.toISOString() || null,
    expiry_date: listing.expiry_date?.toISOString() || null,
    status: listing.status || null,
    views: listing.views?.toString() || null,
    cover_image: listing.cover_image || null,
    images: Array.isArray(listing.images)
      ? listing.images.map((url: string) => ({ imageUrl: url }))
      : null,
    is_boosted: listing.is_boosted?.toString() || null,
    is_boosted_type: listing.is_boosted_type || null,
    is_boosted_expiry_date: listing.is_boosted_expiry_date || null,
    tags: Array.isArray(listing.tags) ? listing.tags : null,
    condition: listing.condition || null,
    negotiable: listing.negotiable?.toString() || null,
    delivery_available: listing.delivery_available?.toString() || null,
    rating: listing.rating?.toString() || null,
    user: listing.user
      ? {
          id: listing.user.id.toString(),
          name: listing.user.name || null,
          username: listing.user.username || null,
          profilePicture: listing.user.profilePicture || null,
          profilImage: listing.user.profilImage || null,
          image: listing.user.image || null,
        }
      : null,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    // 1. Authenticate user
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 2. Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
          details: "Unable to find user account",
        },
        { status: 404 }
      );
    }

    // 3. Get and verify the listing
    const listingId = BigInt(params.listingId);
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilImage: true,
            profilePicture: true,
            image: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        {
          error: "Listing not found",
          details: "The listing you're trying to publish doesn't exist",
        },
        { status: 404 }
      );
    }

    // 4. Verify ownership
    if (listing.user_id !== user.id) {
      return NextResponse.json(
        {
          error: "Unauthorized action",
          details: "You can only publish your own listings",
        },
        { status: 403 }
      );
    }

    // 5. Check if listing is already published
    if (listing.status === "active") {
      return NextResponse.json(
        {
          error: "Already published",
          details: "This listing is already active",
        },
        { status: 400 }
      );
    }

    // 6. Update listing status
    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: "active",
        updated_at: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            profilImage: true,
            profilePicture: true,
            image: true,
          },
        },
      },
    });

    // 7. Revalidate caches
    revalidateTag("listings");
    revalidatePath("/profile/user-dashboard/[username]", "page");
    revalidatePath("/");

    // 8. Return serialized response
    const serializedListing = serializeListing(updatedListing);

    return NextResponse.json(
      {
        message: "Listing published successfully",
        listing: serializedListing,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error publishing listing:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("BigInt")) {
        return NextResponse.json(
          {
            error: "Invalid listing ID",
            details: "The provided listing ID is not valid",
          },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error: "Failed to publish listing",
        details:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
