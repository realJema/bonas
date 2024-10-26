import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { CreateListingSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";

export async function POST(request: Request) {
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

    // 3. Get user from database using email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Parse and validate request body
    const body = await request.json();

    try {
      const validatedData = CreateListingSchema.parse(body);

      // 5. Get the most specific category ID based on hierarchy
      let categoryId: number | null | undefined = null;

      if (validatedData.subSubcategory) {
        // First try to find the sub-subcategory
        const subSubCategory = await prisma.category.findFirst({
          where: {
            name: validatedData.subSubcategory,
            parent: {
              name: validatedData.subcategory,
              parent: {
                name: validatedData.category,
              },
            },
          },
          select: { id: true },
        });
        categoryId = subSubCategory?.id;
      }

      if (!categoryId && validatedData.subcategory) {
        // If no sub-subcategory found, try to find the subcategory
        const subCategory = await prisma.category.findFirst({
          where: {
            name: validatedData.subcategory,
            parent: {
              name: validatedData.category,
            },
          },
          select: { id: true },
        });
        categoryId = subCategory?.id;
      }

      if (!categoryId) {
        // If no subcategory found, find the main category
        const mainCategory = await prisma.category.findFirst({
          where: {
            name: validatedData.category,
            parent: null, // Main categories have no parent
          },
          select: { id: true },
        });
        categoryId = mainCategory?.id;
      }

      if (!categoryId) {
        return NextResponse.json(
          { error: "Invalid category hierarchy" },
          { status: 400 }
        );
      }

      // 6. Create listing and images in a transaction
      const listing = await prisma.$transaction(async (prisma) => {
        // 6.1 Create the main listing
        const newListing = await prisma.listing.create({
          data: {
            title: validatedData.title,
            description: validatedData.description,
            location: validatedData.location,
            timeline: validatedData.timeline,
            budget: validatedData.budget,
            categoryId: categoryId!, // Using the most specific category ID
            userId: user.id,
          },
        });

        // 6.2 Create the images if provided
        if (validatedData.listingImages?.length > 0) {
          await prisma.image.createMany({
            data: validatedData.listingImages.map((imageUrl) => ({
              listingId: newListing.id,
              imageUrl: imageUrl,
            })),
          });
        }

        // 6.3 Return complete listing with relations
        return prisma.listing.findUnique({
          where: { id: newListing.id },
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
            category: {
              include: {
                parent: {
                  include: {
                    parent: true,
                  },
                },
              },
            },
            images: true,
          },
        });
      });

      // Add cache revalidation after successful creation
      revalidateTag("listings-by-user-id");

      // Also revalidate the specific user's listings cache
      revalidateTag(`user-${user.id}-listings`);

      // revalidate all listings
      revalidateTag("listings")

      // 7. Return success response
      return NextResponse.json(listing, { status: 201 });
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
      throw error;
    }
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
