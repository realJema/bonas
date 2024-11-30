// app/api/postListing/[listingId]/route.ts
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { v2 as cloudinary } from "cloudinary";
import { Prisma } from "@prisma/client";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Same serialization function as POST
function serializeListing(listing: any) {
  return {
    ...listing,
    id: listing.id.toString(),
    subcategory_id: listing.subcategory_id?.toString(),
    negotiable: listing.negotiable?.toString(),
    delivery_available: listing.delivery_available?.toString(),
    user: listing.user
      ? {
          ...listing.user,
          id: listing.user.id.toString(),
        }
      : undefined,
  };
}

// Same validation schema as POST
const ListingSchema = z
  .object({
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
    cover_image: z.string().url("Invalid cover image URL"),
    listingImages: z
      .array(z.string().url())
      .max(5, "Maximum 5 images allowed")
      .optional(),
    deadline: z
      .string()
      .or(z.date())
      .transform((val) => new Date(val)),
    tags: z.array(z.string()).optional(),
    negotiable: z.boolean().optional(),
    delivery_available: z.boolean().optional(),
    status: z.enum(["active", "inactive"]).default("inactive"),
  })
  .partial({ cover_image: true });

// Same upload function as POST
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
            type === "cover"
              ? [{ width: 1000, height: 1000, crop: "limit" }]
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

export async function PUT(
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

    // 2. Get user and listing
    const listingId = BigInt(params.listingId);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const existingListing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!existingListing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (existingListing.user_id !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to update this listing" },
        { status: 403 }
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

    try {
      // 4. Handle Image Uploads
      let coverImageUrl: string | undefined;
      let listingImageUrls: string[] = [];

      // Upload cover image if it's a base64 string
      if (body.cover_image && body.cover_image.startsWith("data:image/")) {
        coverImageUrl = await uploadToCloudinary(body.cover_image, "cover");
      }

      // Upload listing images if they're base64 strings
      if (body.listingImages && body.listingImages.length > 0) {
        listingImageUrls = await Promise.all(
          body.listingImages.map((image: string) =>
            image.startsWith("data:image/")
              ? uploadToCloudinary(image, "listing")
              : image
          )
        );
      }

      // 5. Update the listing
      const updatedListing = await prisma.listing.update({
        where: { id: listingId },
        data: {
          title: body.title,
          description: body.description,
          price:
            typeof body.price === "string"
              ? parseFloat(body.price)
              : body.price,
          currency: body.currency || "XAF",
          town: body.town,
          address: body.address,
          cover_image: coverImageUrl || existingListing.cover_image,
          images:
            listingImageUrls.length > 0
              ? listingImageUrls
              : existingListing.images || Prisma.JsonNull,
          deadline: body.deadline ? new Date(body.deadline) : null,
          subcategory_id: BigInt(body.subcategory_id),
          tags: body.tags?.length > 0 ? body.tags : Prisma.JsonNull,
          negotiable: body.negotiable ? BigInt(1) : BigInt(0),
          delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
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

      // 6. Revalidate caches
      revalidateTag("listings");
      revalidatePath("/profile/user-dashboard/[username]", "page");

      return NextResponse.json(serializeListing(updatedListing), {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      });
    } catch (error: any) {
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Failed to update listing" },
        { status: 500 }
      );
    }
  } catch (error) {
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
// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { revalidatePath, revalidateTag } from "next/cache";
// import { v2 as cloudinary } from "cloudinary";
// import { Prisma } from "@prisma/client";

// cloudinary.config({
//   cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
//   secure: true,
// });

// function serializeListing(listing: any) {
//   return {
//     ...listing,
//     id: listing.id.toString(),
//     subcategory_id: listing.subcategory_id?.toString(),
//     negotiable: listing.negotiable?.toString(),
//     delivery_available: listing.delivery_available?.toString(),
//     user: listing.user
//       ? {
//           ...listing.user,
//           id: listing.user.id.toString(),
//         }
//       : null,
//   };
// }

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

// export async function PUT(
//   request: Request,
//   { params }: { params: { listingId: string } }
// ) {
//   try {
//     const session = await auth();
//     if (!session?.user?.email) {
//       return NextResponse.json(
//         { error: "Unauthorized - Please sign in" },
//         { status: 401 }
//       );
//     }

//     const listingId = BigInt(params.listingId);

//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const existingListing = await prisma.listing.findUnique({
//       where: { id: listingId },
//     });

//     if (!existingListing) {
//       return NextResponse.json({ error: "Listing not found" }, { status: 404 });
//     }

//     if (existingListing.user_id !== user.id) {
//       return NextResponse.json(
//         { error: "Unauthorized to update this listing" },
//         { status: 403 }
//       );
//     }

//     const body = await request.json();

//     try {
//       let profileImageUrl: string | undefined;
//       let coverImageUrl: string | undefined;
//       let additionalImages: string[] = [];

//       if (body.profileImage && body.profileImage.startsWith("data:image/")) {
//         try {
//           profileImageUrl = await uploadToCloudinary(
//             body.profileImage,
//             "profile"
//           );
//         } catch (error) {
//           return NextResponse.json(
//             { error: "Failed to upload profile image" },
//             { status: 400 }
//           );
//         }
//       }

//       if (body.cover_image && body.cover_image.startsWith("data:image/")) {
//         try {
//           coverImageUrl = await uploadToCloudinary(body.cover_image, "cover");
//         } catch (error) {
//           return NextResponse.json(
//             { error: "Failed to upload cover image" },
//             { status: 400 }
//           );
//         }
//       }

//       if (body.images && body.images.length > 0) {
//         try {
//           additionalImages = await Promise.all(
//             body.images.map((image: string) =>
//               image.startsWith("data:image/")
//                 ? uploadToCloudinary(image, "additional")
//                 : image
//             )
//           );
//         } catch (error) {
//           return NextResponse.json(
//             { error: "Failed to upload additional images" },
//             { status: 400 }
//           );
//         }
//       }

//       const imagesData:
//         | Prisma.InputJsonValue
//         | Prisma.NullableJsonNullValueInput =
//         additionalImages.length > 0
//           ? additionalImages
//           : existingListing.images || Prisma.JsonNull;

//       const tagsData:
//         | Prisma.InputJsonValue
//         | Prisma.NullableJsonNullValueInput =
//         body.tags?.length > 0 ? body.tags : Prisma.JsonNull;

//       const [updatedUser, updatedListing] = await prisma.$transaction([
//         profileImageUrl
//           ? prisma.user.update({
//               where: { id: user.id },
//               data: { profilImage: profileImageUrl },
//             })
//           : prisma.user.findUnique({ where: { id: user.id } }),

//         prisma.listing.update({
//           where: { id: listingId },
//           data: {
//             title: body.title,
//             description: body.description,
//             price:
//               typeof body.price === "string"
//                 ? parseFloat(body.price)
//                 : body.price,
//             currency: body.currency || "XAF",
//             town: body.town,
//             address: body.address,
//             timeline: body.timeline,
//             subcategory_id: BigInt(body.subcategory_id),
//             cover_image: coverImageUrl || existingListing.cover_image,
//             images: imagesData,
//             tags: tagsData,
//             condition: body.condition,
//             negotiable: body.negotiable ? BigInt(1) : BigInt(0),
//             delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
//             updated_at: new Date(),
//           },
//           include: {
//             user: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 image: true,
//                 username: true,
//                 profilImage: true,
//               },
//             },
//           },
//         }),
//       ]);

//       revalidateTag("listings");
//       revalidatePath("/profile/user-dashboard/[username]", "page");

//       return NextResponse.json(serializeListing(updatedListing), {
//         status: 200,
//         headers: {
//           "Cache-Control": "no-store, max-age=0",
//         },
//       });
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
//     console.error("Error updating listing:", error);
//     return NextResponse.json(
//       { error: "Failed to update listing" },
//       { status: 500 }
//     );
//   }
// }

// export const dynamic = "force-dynamic";
