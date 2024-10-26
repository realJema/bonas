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

    // 7. Get the most specific category ID based on hierarchy
    let categoryId: number | null | undefined = existingListing.categoryId;

    if (validatedData.category) {
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

    // Invalidate all relevant caches
    revalidateTag("listings-by-user-id");
    revalidateTag(`user-${user.id}-listings`);
    revalidateTag(`listings`);

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

export const dynamic = "force-dynamic";

// import { auth } from "@/auth";
// import prisma from "@/prisma/client";
// import { UpdateListingSchema } from "@/schemas";
// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { revalidateTag } from "next/cache";

// export async function PUT(
//   request: Request,
//   { params }: { params: { listingId: string } }
// ) {
//   try {
//     // 1. Get authenticated session
//     const session = await auth();

//     // 2. Check if user is authenticated and has an email
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please sign in" },
//         { status: 401 }
//       );
//     }

//     // 3. Get listing ID from params and validate
//     const listingId = parseInt(params.listingId);
//     if (isNaN(listingId)) {
//       return NextResponse.json(
//         { error: "Invalid listing ID" },
//         { status: 400 }
//       );
//     }

//     // 4. Get user from database
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 5. Verify listing exists and belongs to user
//     const existingListing = await prisma.listing.findUnique({
//       where: { id: listingId },
//     });

//     if (!existingListing) {
//       return NextResponse.json({ error: "Listing not found" }, { status: 404 });
//     }

//     if (existingListing.userId !== user.id) {
//       return NextResponse.json(
//         { error: "Unauthorized to update this listing" },
//         { status: 403 }
//       );
//     }

//     // 6. Parse and validate request body
//     const body = await request.json();
//     const validatedData = UpdateListingSchema.parse(body);

//     // 7. Get category ID if provided
//     let categoryId = existingListing.categoryId;
//     if (validatedData.category) {
//       const categoryData = await prisma.category.findFirst({
//         where: { name: validatedData.category },
//         select: { id: true },
//       });

//       if (!categoryData) {
//         return NextResponse.json(
//           { error: `Category '${validatedData.category}' not found` },
//           { status: 400 }
//         );
//       }
//       categoryId = categoryData.id;
//     }

//     // 8. Update listing and images in a transaction
//     const updatedListing = await prisma.$transaction(async (tx) => {
//       // 8.1 Update the main listing
//       const listing = await tx.listing.update({
//         where: { id: listingId },
//         data: {
//           title: validatedData.title,
//           description: validatedData.description,
//           location: validatedData.location,
//           timeline: validatedData.timeline,
//           budget: validatedData.budget as number,
//           categoryId: categoryId,
//           updatedAt: new Date(),
//         },
//       });

//       // 8.2 Update images if provided
//       if (validatedData.listingImages?.length > 0) {
//         // Delete existing images
//         await tx.image.deleteMany({
//           where: { listingId: listingId },
//         });

//         // Create new images
//         await tx.image.createMany({
//           data: validatedData.listingImages.map((imageUrl) => ({
//             listingId: listingId,
//             imageUrl: imageUrl,
//           })),
//         });
//       }

//       // 8.3 Return updated listing with relations
//       return tx.listing.findUnique({
//         where: { id: listingId },
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               profilePicture: true,
//               username: true,
//             },
//           },
//           category: true,
//           images: true,
//         },
//       });
//     });

//     revalidateTag("listings-by-user-id");

//     // 9. Return success response
//     return NextResponse.json(updatedListing, {
//       status: 200,
//       headers: {
//         "Cache-Control": "no-store, max-age=0",
//       },
//     });
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       return NextResponse.json(
//         {
//           error: "Validation failed",
//           details: error.errors.map((err) => ({
//             path: err.path.join("."),
//             message: err.message,
//           })),
//         },
//         { status: 400 }
//       );
//     }
//     console.error("Error updating listing:", error);
//     return NextResponse.json(
//       { error: "Failed to update listing" },
//       { status: 500 }
//     );
//   }
// }

// export const dynamic = "force-dynamic";
