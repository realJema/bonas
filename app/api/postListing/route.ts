import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { v2 as cloudinary } from "cloudinary";
import { Prisma } from "@prisma/client";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Helper function to serialize BigInt fields
function serializeListingForResponse(listing: any) {
  return {
    ...listing,
    id: listing.id.toString(),
    subcategory_id: listing.subcategory_id?.toString(),
    negotiable: listing.negotiable?.toString(),
    delivery_available: listing.delivery_available?.toString(),
  };
}

// Helper function to upload images to Cloudinary
async function uploadToCloudinary(
  base64Image: string,
  type: string
): Promise<string> {
  try {
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    return new Promise((resolve, reject) => {
      const timestamp = new Date().toISOString().split("T")[0];
      const fileName = `listing_${timestamp}_${type}_${Date.now()}`;

      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "Listings",
          public_id: fileName,
          resource_type: "auto" as const,
          timeout: 60000,
          transformation:
            type === "profile"
              ? [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
              : [{ width: 1000, height: 1000, crop: "limit" }],
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
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 3. Parse request body
    const body = await request.json();

    try {
      // 4. Handle profile image upload
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

      // 5. Handle listing images upload
      let listingImages: string[] = [];
      if (body.listingImages && body.listingImages.length > 0) {
        try {
          listingImages = await Promise.all(
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

      // 6. Create the listing
      const listing = await prisma.$transaction(async (prisma) => {
        // Update user's profile image if provided
        if (profileImageUrl) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              profilImage: profileImageUrl,
            },
          });
        }

        // Prepare JSON fields
        const imagesData:
          | Prisma.InputJsonValue
          | Prisma.NullableJsonNullValueInput =
          listingImages.length > 0 ? listingImages : Prisma.JsonNull;

        const tagsData:
          | Prisma.InputJsonValue
          | Prisma.NullableJsonNullValueInput =
          body.tags?.length > 0 ? body.tags : Prisma.JsonNull;

        // Create main listing
        const newListing = await prisma.listing.create({
          data: {
            id: BigInt(Date.now()),
            title: body.title,
            description: body.description,
            price:
              typeof body.price === "string"
                ? parseFloat(body.price)
                : body.price,
            currency: body.currency || "XAF",
            town: body.town,
            address: body.address,
            user_id: user.id,
            images: imagesData,
            status: "active",
            timeline: body.timeline,
            subcategory_id: BigInt(body.subcategory_id),
            tags: tagsData,
            condition: body.condition,
            negotiable: body.negotiable ? BigInt(1) : BigInt(0),
            delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
            created_at: new Date(),
            updated_at: new Date(),
          },
        });

        // Return complete listing with relations
        const result = await prisma.listing.findUnique({
          where: { id: newListing.id },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                profilImage: true,
              },
            },
          },
        });

        return result;
      });

      // 7. Revalidate caches
      revalidateTag("listings");
      revalidateTag(`user-${user.id}-listings`);

      // 8. Return success response with serialized data
      return NextResponse.json(
        listing ? serializeListingForResponse(listing) : null,
        { status: 201 }
      );
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
// import { NextResponse } from "next/server";
// import { revalidateTag } from "next/cache";
// import { z } from "zod";
// import { v2 as cloudinary } from "cloudinary";
// import { Prisma } from "@prisma/client";

// // Configure Cloudinary
// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// // Helper function to upload images to Cloudinary
// async function uploadToCloudinary(
//   base64Image: string,
//   type: string
// ): Promise<string> {
//   try {
//     const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Data, "base64");

//     return new Promise((resolve, reject) => {
//       const timestamp = new Date().toISOString().split("T")[0];
//       const fileName = `listing_${timestamp}_${type}_${Date.now()}`;

//       const uploadStream = cloudinary.uploader.upload_stream(
//         {
//           folder: "Listings",
//           public_id: fileName,
//           resource_type: "auto" as const,
//           timeout: 60000,
//           transformation:
//             type === "profile"
//               ? [{ width: 400, height: 400, crop: "fill", gravity: "face" }]
//               : [{ width: 1000, height: 1000, crop: "limit" }],
//         },
//         (error, result) => {
//           if (error) {
//             console.error("Cloudinary upload error:", error);
//             reject(error);
//           } else {
//             resolve(result?.secure_url || "");
//           }
//         }
//       );
//       uploadStream.end(buffer);
//     });
//   } catch (error) {
//     console.error("Error processing image:", error);
//     throw new Error("Failed to process image");
//   }
// }

// export async function POST(request: Request) {
//   try {
//     // 1. Authenticate user
//     const session = await auth();
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please sign in" },
//         { status: 401 }
//       );
//     }

//     // 2. Get user from database
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // 3. Parse request body
//     const body = await request.json();

//     try {
//       // 4. Handle profile image upload
//       let profileImageUrl: string | undefined;
//       if (body.profileImage && body.profileImage.startsWith("data:image/")) {
//         try {
//           profileImageUrl = await uploadToCloudinary(
//             body.profileImage,
//             "profile"
//           );
//         } catch (error) {
//           console.error("Profile image upload failed:", error);
//           return NextResponse.json(
//             { error: "Failed to upload profile image" },
//             { status: 400 }
//           );
//         }
//       }

//       // 5. Handle listing images upload
//       let listingImages: string[] = [];
//       if (body.listingImages && body.listingImages.length > 0) {
//         try {
//           listingImages = await Promise.all(
//             body.listingImages.map((image: string) =>
//               image.startsWith("data:image/")
//                 ? uploadToCloudinary(image, "listing")
//                 : image
//             )
//           );
//         } catch (error) {
//           console.error("Listing images upload failed:", error);
//           return NextResponse.json(
//             { error: "Failed to upload listing images" },
//             { status: 400 }
//           );
//         }
//       }

//       // 6. Create the listing
//       const listing = await prisma.$transaction(async (prisma) => {
//         // Update user's profile image if provided
//         if (profileImageUrl) {
//           await prisma.user.update({
//             where: { id: user.id },
//             data: {
//               profilImage: profileImageUrl,
//             },
//           });
//         }

//         // Prepare JSON fields
//         const imagesData:
//           | Prisma.InputJsonValue
//           | Prisma.NullableJsonNullValueInput =
//           listingImages.length > 0 ? listingImages : Prisma.JsonNull;

//         const tagsData:
//           | Prisma.InputJsonValue
//           | Prisma.NullableJsonNullValueInput =
//           body.tags?.length > 0 ? body.tags : Prisma.JsonNull;

//         // Create main listing
//         const newListing = await prisma.listing.create({
//           data: {
//             id: BigInt(Date.now()),
//             title: body.title,
//             description: body.description,
//             price:
//               typeof body.price === "string"
//                 ? parseFloat(body.price)
//                 : body.price,
//             currency: body.currency || "XAF",
//             town: body.town,
//             address: body.address,
//             user_id: user.id,
//             images: imagesData,
//             status: "active",
//             timeline: body.timeline,
//             subcategory_id: BigInt(body.subcategory_id),
//             tags: tagsData,
//             condition: body.condition,
//             negotiable: body.negotiable ? BigInt(1) : BigInt(0),
//             delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
//             created_at: new Date(),
//             updated_at: new Date(),
//           },
//         });

//         // Return complete listing with relations
//         return prisma.listing.findUnique({
//           where: { id: newListing.id },
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 username: true,
//                 profilImage: true,
//               },
//             },
//           },
//         });
//       });

//       // 7. Revalidate caches
//       revalidateTag("listings");
//       revalidateTag(`user-${user.id}-listings`);

//       // 8. Return success response
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

// // import { auth } from "@/auth";
// // import prisma from "@/prisma/client";
// // import { CreateListingSchema } from "@/schemas";
// // import { NextResponse } from "next/server";
// // import { revalidateTag } from "next/cache";
// // import { z } from "zod";
// // import { v2 as cloudinary } from "cloudinary";
// // import { Prisma } from "@prisma/client";

// // // Configure Cloudinary
// // cloudinary.config({
// //   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET,
// //   secure: true,
// // });

// // // Helper function to upload images to Cloudinary
// // async function uploadToCloudinary(
// //   base64Image: string,
// //   type: string
// // ): Promise<string> {
// //   try {
// //     const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
// //     const buffer = Buffer.from(base64Data, "base64");

// //     return new Promise((resolve, reject) => {
// //       const timestamp = new Date().toISOString().split("T")[0];
// //       const fileName = `listing_${timestamp}_${type}_${Date.now()}`;

// //       const uploadStream = cloudinary.uploader.upload_stream(
// //         {
// //           folder: "Listings",
// //           public_id: fileName,
// //           resource_type: "auto" as const,
// //           timeout: 60000,
// //           transformation: [{ width: 1000, height: 1000, crop: "limit" }],
// //         },
// //         (error, result) => {
// //           if (error) {
// //             console.error("Cloudinary upload error:", error);
// //             reject(error);
// //           } else {
// //             resolve(result?.secure_url || "");
// //           }
// //         }
// //       );
// //       uploadStream.end(buffer);
// //     });
// //   } catch (error) {
// //     console.error("Error processing image:", error);
// //     throw new Error("Failed to process image");
// //   }
// // }

// // export async function POST(request: Request) {
// //   try {
// //     // 1. Authenticate user
// //     const session = await auth();
// //     if (!session?.user?.email) {
// //       return NextResponse.json(
// //         { error: "Unauthorized - Please sign in" },
// //         { status: 401 }
// //       );
// //     }

// //     // 2. Get user from database
// //     const user = await prisma.user.findUnique({
// //       where: { email: session.user.email },
// //     });

// //     if (!user) {
// //       return NextResponse.json({ error: "User not found" }, { status: 404 });
// //     }

// //     // 3. Parse request body
// //     const body = await request.json();

// //     try {
// //       // 4. Handle image uploads
// //       let coverImageUrl: string | undefined;
// //       let additionalImages: string[] = [];

// //       // Upload cover image if provided
// //       if (body.coverImage && body.coverImage.startsWith("data:image/")) {
// //         try {
// //           coverImageUrl = await uploadToCloudinary(body.coverImage, "cover");
// //         } catch (error) {
// //           console.error("Cover image upload failed:", error);
// //           return NextResponse.json(
// //             { error: "Failed to upload cover image" },
// //             { status: 400 }
// //           );
// //         }
// //       }

// //       // Upload additional images if provided
// //       if (body.images && body.images.length > 0) {
// //         try {
// //           additionalImages = await Promise.all(
// //             body.images.map((image: string) =>
// //               image.startsWith("data:image/")
// //                 ? uploadToCloudinary(image, "additional")
// //                 : image
// //             )
// //           );
// //         } catch (error) {
// //           console.error("Additional images upload failed:", error);
// //           return NextResponse.json(
// //             { error: "Failed to upload additional images" },
// //             { status: 400 }
// //           );
// //         }
// //       }

// //       // 5. Prepare data for validation
// //       const dataToValidate = {
// //         ...body,
// //         price:
// //           typeof body.price === "string" ? parseFloat(body.price) : body.price,
// //         cover_image: coverImageUrl || body.cover_image,
// //         images: additionalImages,
// //       };

// //       // 6. Create the listing
// //       const listing = await prisma.$transaction(async (prisma) => {
// //         // Prepare the images data
// //         const imagesData:
// //           | Prisma.InputJsonValue
// //           | Prisma.NullableJsonNullValueInput =
// //           additionalImages.length > 0 ? additionalImages : Prisma.JsonNull;

// //         // Prepare the tags data
// //         const tagsData:
// //           | Prisma.InputJsonValue
// //           | Prisma.NullableJsonNullValueInput =
// //           body.tags?.length > 0 ? body.tags : Prisma.JsonNull;

// //         // Create main listing
// //         const newListing = await prisma.listing.create({
// //           data: {
// //             id: BigInt(Date.now()),
// //             title: body.title,
// //             description: body.description,
// //             price: dataToValidate.price,
// //             currency: body.currency || "USD",
// //             town: body.town,
// //             address: body.address,
// //             user_id: user.id,
// //             cover_image: coverImageUrl,
// //             images: imagesData,
// //             status: "active",
// //             timeline: body.timeline,
// //             subcategory_id: BigInt(body.subcategory_id),
// //             tags: tagsData,
// //             condition: body.condition,
// //             negotiable: body.negotiable ? BigInt(1) : BigInt(0),
// //             delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
// //             created_at: new Date(),
// //             updated_at: new Date(),
// //           },
// //         });

// //         // Return complete listing with relations
// //         return prisma.listing.findUnique({
// //           where: { id: newListing.id },
// //           include: {
// //             user: {
// //               select: {
// //                 id: true,
// //                 name: true,
// //                 email: true,
// //                 image: true,
// //                 username: true,
// //               },
// //             },
// //           },
// //         });
// //       });

// //       // 7. Revalidate caches
// //       revalidateTag("listings");
// //       revalidateTag(`user-${user.id}-listings`);

// //       // 8. Return success response
// //       return NextResponse.json(listing, { status: 201 });
// //     } catch (error) {
// //       if (error instanceof z.ZodError) {
// //         return NextResponse.json(
// //           {
// //             error: "Validation failed",
// //             details: error.errors.map((err) => ({
// //               path: err.path.join("."),
// //               message: err.message,
// //             })),
// //           },
// //           { status: 400 }
// //         );
// //       }
// //       throw error;
// //     }
// //   } catch (error) {
// //     console.error("Error creating listing:", error);
// //     return NextResponse.json(
// //       { error: "Failed to create listing" },
// //       { status: 500 }
// //     );
// //   }
// // }

// // // // app/api/postLising

// // // import { auth } from "@/auth";
// // // import prisma from "@/prisma/client";
// // // import { CreateListingSchema } from "@/schemas";
// // // import { NextResponse } from "next/server";
// // // import { revalidateTag } from "next/cache";
// // // import { z } from "zod";
// // // import { v2 as cloudinary } from "cloudinary";

// // // // Configure Cloudinary with your credentials
// // // cloudinary.config({
// // //   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
// // //   api_key: process.env.CLOUDINARY_API_KEY,
// // //   api_secret: process.env.CLOUDINARY_API_SECRET,
// // //   secure: true,
// // // });

// // // // Helper function to upload a single image to Cloudinary
// // // async function uploadToCloudinary(
// // //   base64Image: string,
// // //   subcategory: string
// // // ): Promise<string> {
// // //   try {
// // //     // Remove the data:image/[type];base64, prefix if present
// // //     const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");
// // //     const buffer = Buffer.from(base64Data, "base64");

// // //     return new Promise((resolve, reject) => {
// // //       const timestamp = new Date().toISOString().split("T")[0];
// // //       const fileName = `bollo_${timestamp}_${subcategory}_${Date.now()}`;

// // //       const uploadStream = cloudinary.uploader.upload_stream(
// // //         {
// // //           folder: "Bollo",
// // //           public_id: fileName,
// // //           resource_type: "auto" as const,
// // //           timeout: 60000,
// // //           transformation: [{ width: 1000, height: 1000, crop: "limit" }],
// // //         },
// // //         (error, result) => {
// // //           if (error) {
// // //             console.error("Cloudinary upload error:", error);
// // //             reject(error);
// // //           } else {
// // //             resolve(result?.secure_url || "");
// // //           }
// // //         }
// // //       );
// // //       uploadStream.end(buffer);
// // //     });
// // //   } catch (error) {
// // //     console.error("Error processing image:", error);
// // //     throw new Error("Failed to process image");
// // //   }
// // // }

// // // export async function POST(request: Request) {
// // //   try {
// // //     // 1. Get authenticated session
// // //     const session = await auth();

// // //     // 2. Check if user is authenticated and has an email
// // //     if (!session?.user?.email) {
// // //       return NextResponse.json(
// // //         { error: "Unauthorized - Please sign in" },
// // //         { status: 401 }
// // //       );
// // //     }

// // //     // 3. Get user from database using email
// // //     const user = await prisma.user.findUnique({
// // //       where: { email: session.user.email },
// // //     });

// // //     if (!user) {
// // //       return NextResponse.json({ error: "User not found" }, { status: 404 });
// // //     }

// // //     // 4. Parse request body
// // //     const body = await request.json();

// // //     try {
// // //       // 5. Upload images to Cloudinary first

// // //       // Handle profile image upload if provided
// // //       let profileImageUrl: string | undefined;
// // //       if (body.profileImage && body.profileImage.startsWith("data:image/")) {
// // //         try {
// // //           profileImageUrl = await uploadToCloudinary(
// // //             body.profileImage,
// // //             "profile"
// // //           );
// // //         } catch (error) {
// // //           console.error("Profile image upload failed:", error);
// // //           return NextResponse.json(
// // //             { error: "Failed to upload profile image" },
// // //             { status: 400 }
// // //           );
// // //         }
// // //       }

// // //       let listingImageUrls: string[] = [];
// // //       if (body.listingImages && body.listingImages.length > 0) {
// // //         try {
// // //           listingImageUrls = await Promise.all(
// // //             body.listingImages.map((image: string) =>
// // //               image.startsWith("data:image/")
// // //                 ? uploadToCloudinary(image, "listing")
// // //                 : image
// // //             )
// // //           );
// // //         } catch (error) {
// // //           console.error("Listing images upload failed:", error);
// // //           return NextResponse.json(
// // //             { error: "Failed to upload listing images" },
// // //             { status: 400 }
// // //           );
// // //         }
// // //       }

// // //       // 6. Prepare the data for validation with Cloudinary URLs
// // //       const dataToValidate = {
// // //         ...body,
// // //         profileImage: profileImageUrl || body.profileImage,
// // //         listingImages: listingImageUrls,
// // //         budget:
// // //           typeof body.budget === "string"
// // //             ? parseFloat(body.budget)
// // //             : body.budget,
// // //       };

// // //       // 7. Validate the data
// // //       const validatedData = CreateListingSchema.parse(dataToValidate);

// // //       // 8. Get the most specific category ID based on hierarchy
// // //       let categoryId: number | null | undefined = null;

// // //       if (validatedData.subSubcategory) {
// // //         const subSubCategory = await prisma.category.findFirst({
// // //           where: {
// // //             name: validatedData.subSubcategory,
// // //             parent: {
// // //               name: validatedData.subcategory,
// // //               parent: {
// // //                 name: validatedData.category,
// // //               },
// // //             },
// // //           },
// // //           select: { id: true },
// // //         });
// // //         categoryId = subSubCategory?.id;
// // //       }

// // //       if (!categoryId && validatedData.subcategory) {
// // //         const subCategory = await prisma.category.findFirst({
// // //           where: {
// // //             name: validatedData.subcategory,
// // //             parent: {
// // //               name: validatedData.category,
// // //             },
// // //           },
// // //           select: { id: true },
// // //         });
// // //         categoryId = subCategory?.id;
// // //       }

// // //       if (!categoryId) {
// // //         const mainCategory = await prisma.category.findFirst({
// // //           where: {
// // //             name: validatedData.category,
// // //             parent: null,
// // //           },
// // //           select: { id: true },
// // //         });
// // //         categoryId = mainCategory?.id;
// // //       }

// // //       if (!categoryId) {
// // //         return NextResponse.json(
// // //           { error: "Invalid category hierarchy" },
// // //           { status: 400 }
// // //         );
// // //       }

// // //       // 9. Create listing and images in a transaction
// // //       const listing = await prisma.$transaction(async (prisma) => {
// // //         // 9.0 Update user's profile picture if provided
// // //         if (profileImageUrl) {
// // //           await prisma.user.update({
// // //             where: { id: user.id },
// // //             data: {
// // //               profilePicture: profileImageUrl,
// // //               image: profileImageUrl, // Update both fields for consistency
// // //             },
// // //           });
// // //         }

// // //         // 9.1 Create the main listing
// // //         const newListing = await prisma.listing.create({
// // //           data: {
// // //             title: validatedData.title,
// // //             description: validatedData.description,
// // //             location: validatedData.location,
// // //             timeline: validatedData.timeline,
// // //             budget: validatedData.budget,
// // //             categoryId: categoryId!,
// // //             userId: user.id,
// // //           },
// // //         });

// // //         // 9.2 Create the images if provided
// // //         if (listingImageUrls.length > 0) {
// // //           await prisma.image.createMany({
// // //             data: listingImageUrls.map((imageUrl) => ({
// // //               listingId: newListing.id,
// // //               imageUrl: imageUrl,
// // //             })),
// // //           });
// // //         }

// // //         // 9.3 Return complete listing with relations
// // //         return prisma.listing.findUnique({
// // //           where: { id: newListing.id },
// // //           include: {
// // //             user: {
// // //               select: {
// // //                 id: true,
// // //                 name: true,
// // //                 email: true,
// // //                 profilePicture: true,
// // //                 username: true,
// // //               },
// // //             },
// // //             category: {
// // //               include: {
// // //                 parent: {
// // //                   include: {
// // //                     parent: true,
// // //                   },
// // //                 },
// // //               },
// // //             },
// // //             images: true,
// // //           },
// // //         });
// // //       });

// // //       // 10. Revalidate caches
// // //       revalidateTag("listings-by-user-id");
// // //       revalidateTag(`user-${user.id}-listings`);
// // //       revalidateTag("listings");

// // //       // 11. Return success response
// // //       // console.log("new created listing: ", listing);
// // //       return NextResponse.json(listing, { status: 201 });
// // //     } catch (error) {
// // //       if (error instanceof z.ZodError) {
// // //         return NextResponse.json(
// // //           {
// // //             error: "Validation failed",
// // //             details: error.errors.map((err) => ({
// // //               path: err.path.join("."),
// // //               message: err.message,
// // //             })),
// // //           },
// // //           { status: 400 }
// // //         );
// // //       }
// // //       throw error;
// // //     }
// // //   } catch (error) {
// // //     console.error("Error creating listing:", error);
// // //     return NextResponse.json(
// // //       { error: "Failed to create listing" },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }

// // // import { auth } from "@/auth";
// // // import prisma from "@/prisma/client";
// // // import { CreateListingSchema } from "@/schemas";
// // // import { NextResponse } from "next/server";
// // // import { revalidateTag } from "next/cache";
// // // import { z } from "zod";

// // // export async function POST(request: Request) {
// // //   try {
// // //     // 1. Get authenticated session
// // //     const session = await auth();

// // //     // 2. Check if user is authenticated and has an email
// // //     if (!session?.user?.email) {
// // //       return NextResponse.json(
// // //         { error: "Unauthorized - Please sign in" },
// // //         { status: 401 }
// // //       );
// // //     }

// // //     // 3. Get user from database using email
// // //     const user = await prisma.user.findUnique({
// // //       where: { email: session.user.email },
// // //     });

// // //     if (!user) {
// // //       return NextResponse.json({ error: "User not found" }, { status: 404 });
// // //     }

// // //     // 4. Parse and validate request body
// // //     const body = await request.json();

// // //     try {
// // //       const validatedData = CreateListingSchema.parse(body);

// // //       // 5. Get the most specific category ID based on hierarchy
// // //       let categoryId: number | null | undefined = null;

// // //       if (validatedData.subSubcategory) {
// // //         // First try to find the sub-subcategory
// // //         const subSubCategory = await prisma.category.findFirst({
// // //           where: {
// // //             name: validatedData.subSubcategory,
// // //             parent: {
// // //               name: validatedData.subcategory,
// // //               parent: {
// // //                 name: validatedData.category,
// // //               },
// // //             },
// // //           },
// // //           select: { id: true },
// // //         });
// // //         categoryId = subSubCategory?.id;
// // //       }

// // //       if (!categoryId && validatedData.subcategory) {
// // //         // If no sub-subcategory found, try to find the subcategory
// // //         const subCategory = await prisma.category.findFirst({
// // //           where: {
// // //             name: validatedData.subcategory,
// // //             parent: {
// // //               name: validatedData.category,
// // //             },
// // //           },
// // //           select: { id: true },
// // //         });
// // //         categoryId = subCategory?.id;
// // //       }

// // //       if (!categoryId) {
// // //         // If no subcategory found, find the main category
// // //         const mainCategory = await prisma.category.findFirst({
// // //           where: {
// // //             name: validatedData.category,
// // //             parent: null, // Main categories have no parent
// // //           },
// // //           select: { id: true },
// // //         });
// // //         categoryId = mainCategory?.id;
// // //       }

// // //       if (!categoryId) {
// // //         return NextResponse.json(
// // //           { error: "Invalid category hierarchy" },
// // //           { status: 400 }
// // //         );
// // //       }

// // //       // 6. Create listing and images in a transaction
// // //       const listing = await prisma.$transaction(async (prisma) => {
// // //         // 6.1 Create the main listing
// // //         const newListing = await prisma.listing.create({
// // //           data: {
// // //             title: validatedData.title,
// // //             description: validatedData.description,
// // //             location: validatedData.location,
// // //             timeline: validatedData.timeline,
// // //             budget: validatedData.budget,
// // //             categoryId: categoryId!, // Using the most specific category ID
// // //             userId: user.id,
// // //           },
// // //         });

// // //         // 6.2 Create the images if provided
// // //         if (validatedData.listingImages?.length > 0) {
// // //           await prisma.image.createMany({
// // //             data: validatedData.listingImages.map((imageUrl) => ({
// // //               listingId: newListing.id,
// // //               imageUrl: imageUrl,
// // //             })),
// // //           });
// // //         }

// // //         // 6.3 Return complete listing with relations
// // //         return prisma.listing.findUnique({
// // //           where: { id: newListing.id },
// // //           include: {
// // //             user: {
// // //               select: {
// // //                 id: true,
// // //                 name: true,
// // //                 email: true,
// // //                 profilePicture: true,
// // //                 username: true,
// // //               },
// // //             },
// // //             category: {
// // //               include: {
// // //                 parent: {
// // //                   include: {
// // //                     parent: true,
// // //                   },
// // //                 },
// // //               },
// // //             },
// // //             images: true,
// // //           },
// // //         });
// // //       });

// // //       // Add cache revalidation after successful creation
// // //       revalidateTag("listings-by-user-id");

// // //       // Also revalidate the specific user's listings cache
// // //       revalidateTag(`user-${user.id}-listings`);

// // //       // revalidate all listings
// // //       revalidateTag("listings")

// // //       // 7. Return success response
// // //       return NextResponse.json(listing, { status: 201 });
// // //     } catch (error) {
// // //       if (error instanceof z.ZodError) {
// // //         return NextResponse.json(
// // //           {
// // //             error: "Validation failed",
// // //             details: error.errors.map((err) => ({
// // //               path: err.path.join("."),
// // //               message: err.message,
// // //             })),
// // //           },
// // //           { status: 400 }
// // //         );
// // //       }
// // //       throw error;
// // //     }
// // //   } catch (error) {
// // //     console.error("Error creating listing:", error);
// // //     return NextResponse.json(
// // //       { error: "Failed to create listing" },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }
