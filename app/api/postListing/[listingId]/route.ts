import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { UpdateListingSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidateTag } from "next/cache";

export async function PUT(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    // 1. Get authenticated session
    const session = await auth();

    // 2. Check if user is authenticated and has an email
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 3. Get listing ID from params and validate
    const listingId = parseInt(params.listingId);
    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    // 4. Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Verify listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this listing" },
        { status: 403 }
      );
    }

    // 6. Parse and validate request body
    const body = await request.json();
    const validatedData = UpdateListingSchema.parse(body);

    // 7. Get category ID if provided
    let categoryId = existingListing.categoryId;
    if (validatedData.category) {
      const categoryData = await prisma.category.findFirst({
        where: { name: validatedData.category },
        select: { id: true },
      });

      if (!categoryData) {
        return NextResponse.json(
          { error: `Category '${validatedData.category}' not found` },
          { status: 400 }
        );
      }
      categoryId = categoryData.id;
    }

    // 8. Update listing and images in a transaction
    const updatedListing = await prisma.$transaction(async (tx) => {
      // 8.1 Update the main listing
      const listing = await tx.listing.update({
        where: { id: listingId },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          location: validatedData.location,
          timeline: validatedData.timeline,
          budget: validatedData.budget as number, 
          categoryId: categoryId,
          updatedAt: new Date(),
        },
      });

      // 8.2 Update images if provided
      if (validatedData.listingImages?.length > 0) {
        // Delete existing images
        await tx.image.deleteMany({
          where: { listingId: listingId },
        });

        // Create new images
        await tx.image.createMany({
          data: validatedData.listingImages.map((imageUrl) => ({
            listingId: listingId,
            imageUrl: imageUrl,
          })),
        });
      }

      // 8.3 Return updated listing with relations
      return tx.listing.findUnique({
        where: { id: listingId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              profilePicture: true,
              username: true,
            },
          },
          category: true,
          images: true,
        },
      });
    });

    revalidateTag("listings-by-user-id");


    // 9. Return success response
    return NextResponse.json(updatedListing, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors.map((err) => ({
            path: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}



// delete listing

export async function DELETE(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    // 1. Get authenticated session
    const session = await auth();

    // 2. Check if user is authenticated and has an email
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    // 3. Get listing ID from params and validate
    const listingId = parseInt(params.listingId);
    if (isNaN(listingId)) {
      return NextResponse.json(
        { error: "Invalid listing ID" },
        { status: 400 }
      );
    }

    // 4. Get user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. Verify listing exists and belongs to user
    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.userId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to delete this listing" },
        { status: 403 }
      );
    }

    // 6. Delete listing and related data in a transaction
    await prisma.$transaction(async (tx) => {
      // 6.1 Delete all images associated with the listing
      await tx.image.deleteMany({
        where: { listingId: listingId },
      });

      // 6.2 Delete all reviews associated with the listing
      await tx.review.deleteMany({
        where: { listingId: listingId },
      });

      // 6.3 Delete the listing itself
      await tx.listing.delete({
        where: { id: listingId },
      });
    });

    // 7. Revalidate cache tags
    revalidateTag("listings-by-user-id");

    // 8. Return success response
    return NextResponse.json(
      { message: "Listing deleted successfully" },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}


export const dynamic = "force-dynamic";