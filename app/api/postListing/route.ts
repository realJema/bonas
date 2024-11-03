import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { CreateListingSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to upload a single image to Cloudinary
async function uploadToCloudinary(
  base64Image: string,
  subcategory: string
): Promise<string> {
  try {
    // Remove the data:image/[type];base64, prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `bollo_${timestamp}_${subcategory}_${Date.now()}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Bollo",
          public_id: fileName,
          resource_type: "auto" as const,
          timeout: 60000,
          transformation: [{ width: 1000, height: 1000, crop: "limit" }],
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result?.secure_url || "");
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error processing image:", error);
    throw new Error("Failed to process image");
  }
}

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

    // 4. Parse request body
    const body = await request.json();

    try {
      // 5. Upload images to Cloudinary first

      // Handle profile image upload if provided
      let profileImageUrl: string | undefined;
      if (body.profileImage && body.profileImage.startsWith("data:image/")) {
        try {
          profileImageUrl = await uploadToCloudinary(
            body.profileImage,
            "profile"
          );
        } catch (error) {
          console.error("Profile image upload failed:", error);
          return NextResponse.json(
            { error: "Failed to upload profile image" },
            { status: 400 }
          );
        }
      }

      let listingImageUrls: string[] = [];
      if (body.listingImages && body.listingImages.length > 0) {
        try {
          listingImageUrls = await Promise.all(
            body.listingImages.map((image: string) =>
              image.startsWith("data:image/")
                ? uploadToCloudinary(image, "listing")
                : image
            )
          );
        } catch (error) {
          console.error("Listing images upload failed:", error);
          return NextResponse.json(
            { error: "Failed to upload listing images" },
            { status: 400 }
          );
        }
      }

      // 6. Prepare the data for validation with Cloudinary URLs
      const dataToValidate = {
        ...body,
        profileImage: profileImageUrl || body.profileImage,
        listingImages: listingImageUrls,
        budget:
          typeof body.budget === "string"
            ? parseFloat(body.budget)
            : body.budget,
      };

      // 7. Validate the data
      const validatedData = CreateListingSchema.parse(dataToValidate);

      // 8. Get the most specific category ID based on hierarchy
      let categoryId: number | null | undefined = null;

      if (validatedData.subSubcategory) {
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
        const mainCategory = await prisma.category.findFirst({
          where: {
            name: validatedData.category,
            parent: null,
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

      // 9. Create listing and images in a transaction
      const listing = await prisma.$transaction(async (prisma) => {
        // 9.0 Update user's profile picture if provided
        if (profileImageUrl) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              profilePicture: profileImageUrl,
              image: profileImageUrl, // Update both fields for consistency
            },
          });
        }

        // 9.1 Create the main listing
        const newListing = await prisma.listing.create({
          data: {
            title: validatedData.title,
            description: validatedData.description,
            location: validatedData.location,
            timeline: validatedData.timeline,
            budget: validatedData.budget,
            categoryId: categoryId!,
            userId: user.id,
          },
        });

        // 9.2 Create the images if provided
        if (listingImageUrls.length > 0) {
          await prisma.image.createMany({
            data: listingImageUrls.map((imageUrl) => ({
              listingId: newListing.id,
              imageUrl: imageUrl,
            })),
          });
        }

        // 9.3 Return complete listing with relations
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

      // 10. Revalidate caches
      revalidateTag("listings-by-user-id");
      revalidateTag(`user-${user.id}-listings`);
      revalidateTag("listings");
      revalidateTag("jobs");
      revalidateTag("real-estate");
      revalidateTag("vehicles");

      // 11. Return success response
      // console.log("new created listing: ", listing);
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

// import { auth } from "@/auth";
// import prisma from "@/prisma/client";
// import { CreateListingSchema } from "@/schemas";
// import { NextResponse } from "next/server";
// import { revalidateTag } from "next/cache";
// import { z } from "zod";

// export async function POST(request: Request) {
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

//     // 3. Get user from database using email
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 4. Parse and validate request body
//     const body = await request.json();

//     try {
//       const validatedData = CreateListingSchema.parse(body);

//       // 5. Get the most specific category ID based on hierarchy
//       let categoryId: number | null | undefined = null;

//       if (validatedData.subSubcategory) {
//         // First try to find the sub-subcategory
//         const subSubCategory = await prisma.category.findFirst({
//           where: {
//             name: validatedData.subSubcategory,
//             parent: {
//               name: validatedData.subcategory,
//               parent: {
//                 name: validatedData.category,
//               },
//             },
//           },
//           select: { id: true },
//         });
//         categoryId = subSubCategory?.id;
//       }

//       if (!categoryId && validatedData.subcategory) {
//         // If no sub-subcategory found, try to find the subcategory
//         const subCategory = await prisma.category.findFirst({
//           where: {
//             name: validatedData.subcategory,
//             parent: {
//               name: validatedData.category,
//             },
//           },
//           select: { id: true },
//         });
//         categoryId = subCategory?.id;
//       }

//       if (!categoryId) {
//         // If no subcategory found, find the main category
//         const mainCategory = await prisma.category.findFirst({
//           where: {
//             name: validatedData.category,
//             parent: null, // Main categories have no parent
//           },
//           select: { id: true },
//         });
//         categoryId = mainCategory?.id;
//       }

//       if (!categoryId) {
//         return NextResponse.json(
//           { error: "Invalid category hierarchy" },
//           { status: 400 }
//         );
//       }

//       // 6. Create listing and images in a transaction
//       const listing = await prisma.$transaction(async (prisma) => {
//         // 6.1 Create the main listing
//         const newListing = await prisma.listing.create({
//           data: {
//             title: validatedData.title,
//             description: validatedData.description,
//             location: validatedData.location,
//             timeline: validatedData.timeline,
//             budget: validatedData.budget,
//             categoryId: categoryId!, // Using the most specific category ID
//             userId: user.id,
//           },
//         });

//         // 6.2 Create the images if provided
//         if (validatedData.listingImages?.length > 0) {
//           await prisma.image.createMany({
//             data: validatedData.listingImages.map((imageUrl) => ({
//               listingId: newListing.id,
//               imageUrl: imageUrl,
//             })),
//           });
//         }

//         // 6.3 Return complete listing with relations
//         return prisma.listing.findUnique({
//           where: { id: newListing.id },
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 profilePicture: true,
//                 username: true,
//               },
//             },
//             category: {
//               include: {
//                 parent: {
//                   include: {
//                     parent: true,
//                   },
//                 },
//               },
//             },
//             images: true,
//           },
//         });
//       });

//       // Add cache revalidation after successful creation
//       revalidateTag("listings-by-user-id");

//       // Also revalidate the specific user's listings cache
//       revalidateTag(`user-${user.id}-listings`);

//       // revalidate all listings
//       revalidateTag("listings")

//       // 7. Return success response
//       return NextResponse.json(listing, { status: 201 });
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return NextResponse.json(
//           {
//             error: "Validation failed",
//             details: error.errors.map((err) => ({
//               path: err.path.join("."),
//               message: err.message,
//             })),
//           },
//           { status: 400 }
//         );
//       }
//       throw error;
//     }
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     return NextResponse.json(
//       { error: "Failed to create listing" },
//       { status: 500 }
//     );
//   }
// }
