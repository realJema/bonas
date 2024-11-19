// app/api/postListing/route.ts
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
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

// Validation schema
const ListingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(1500),
  price: z
    .number()
    .positive("Price must be positive")
    .max(1000000000, "Price cannot exceed 1,000,000,000"),
  currency: z.string().default("XAF"),
  town: z.string().min(1, "Town is required"),
  address: z.string().min(1, "Address is required"),
  subcategory_id: z.string().or(z.number()),
  profileImage: z.string().optional(),
  listingImages: z
    .array(z.string())
    .min(1, "At least one listing image is required")
    .max(5),
  timeline: z.string().optional(),
  tags: z.array(z.string()).optional(),
  condition: z.string().optional(),
  negotiable: z.boolean().optional(),
  delivery_available: z.boolean().optional(),
  status: z.enum(["active", "inactive"]).default("inactive"),
});

async function uploadToCloudinary(
  base64Image: string,
  type: string
): Promise<string> {
  try {
    if (!base64Image || !base64Image.startsWith("data:image/")) {
      throw new Error("Invalid image format");
    }

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
            reject(new Error("Failed to upload image"));
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

function serializeListingForResponse(listing: any) {
  return {
    ...listing,
    id: listing.id.toString(),
    subcategory_id: listing.subcategory_id?.toString(),
    negotiable: listing.negotiable?.toString(),
    delivery_available: listing.delivery_available?.toString(),
    created_at: listing.created_at?.toISOString(),
    updated_at: listing.updated_at?.toISOString(),
  };
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
      return NextResponse.json(
        { error: "User account not found" },
        { status: 404 }
      );
    }

    // 3. Parse and validate request body
    let body;
    try {
      body = await request.json();
      await ListingSchema.parseAsync(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: "Validation failed",
            details: error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // 4. Handle image uploads
    let profileImageUrl: string | undefined;
    let listingImages: string[] = [];

    try {
      // Upload profile image if provided
      if (body.profileImage?.startsWith("data:image/")) {
        profileImageUrl = await uploadToCloudinary(
          body.profileImage,
          "profile"
        );
      }

      // Upload listing images
      if (body.listingImages?.length > 0) {
        listingImages = await Promise.all(
          body.listingImages.map(
            (
              image: string
            ) =>
              image.startsWith("data:image/")
                ? uploadToCloudinary(image, "listing")
                : image
          )
        );
      }

      // 5. Create listing with transaction
      const listing = await prisma.$transaction(async (prisma) => {
        // Update profile image if provided
        if (profileImageUrl) {
          await prisma.user.update({
            where: { id: user.id },
            data: { profilImage: profileImageUrl },
          });
        }

        // Create the listing
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
            images: listingImages.length > 0 ? listingImages : Prisma.JsonNull,
            status: "inactive",
            timeline: body.timeline,
            subcategory_id: BigInt(body.subcategory_id),
            tags: body.tags?.length > 0 ? body.tags : Prisma.JsonNull,
            condition: body.condition,
            negotiable: body.negotiable ? BigInt(1) : BigInt(0),
            delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
            created_at: new Date(),
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
              },
            },
          },
        });

        return newListing;
      });

      // 6. Revalidate caches
      revalidateTag("listings");
      revalidatePath("/profile/user-dashboard/[username]", "page");
      revalidatePath("/");

      // 7. Return success response
      return NextResponse.json(serializeListingForResponse(listing), {
        status: 201,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A listing with this ID already exists" },
          { status: 409 }
        );
      }
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Failed to process images or create listing" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";


// import { auth } from "@/auth";
// import prisma from "@/prisma/client";
// import { NextResponse } from "next/server";
// import { revalidateTag, revalidatePath } from "next/cache";
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

// // Helper function to serialize BigInt fields
// function serializeListingForResponse(listing: any) {
//   return {
//     ...listing,
//     id: listing.id.toString(),
//     subcategory_id: listing.subcategory_id?.toString(),
//     negotiable: listing.negotiable?.toString(),
//     delivery_available: listing.delivery_available?.toString(),
//   };
// }

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
//         const result = await prisma.listing.findUnique({
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

//         return result;
//       });

//       // 7. Revalidate caches
//       revalidateTag("listings");
//       revalidatePath("/profile/user-dashboard/[username]", "page");
//       revalidatePath("/");

//       // 8. Return success response with serialized data
//       return NextResponse.json(
//         listing ? serializeListingForResponse(listing) : null,
//         { status: 201 }
//       );
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
