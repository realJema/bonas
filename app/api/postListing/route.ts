// app/api/postListing/route.ts
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

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

// Validation schema
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
      .transform((val) => new Date(val)), // Transform both string and date inputs to Date
    tags: z.array(z.string()).optional(),
    negotiable: z.boolean().optional(),
    delivery_available: z.boolean().optional(),
    status: z.enum(["active", "inactive"]).default("inactive"),
  })
  .partial({ cover_image: true });

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

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

    try {
      // Upload images to Cloudinary
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

      // Create listing with transaction
      const listing = await prisma.$transaction(async (prisma) => {
        // Create the listing
        const newListing = await prisma.listing.create({
          data: {
            id: BigInt(Date.now()),
            title: body.title,
            description: body.description, // Rich text HTML is stored as is
            price:
              typeof body.price === "string"
                ? parseFloat(body.price)
                : body.price,
            currency: body.currency || "XAF",
            town: body.town,
            address: body.address,
            user_id: user.id,
            cover_image: coverImageUrl || body.cover_image,
            images:
              listingImageUrls.length > 0 ? listingImageUrls : Prisma.JsonNull,
            status: "inactive",
            deadline: body.deadline ? new Date(body.deadline) : null,
            subcategory_id: BigInt(body.subcategory_id),
            tags: body.tags?.length > 0 ? body.tags : Prisma.JsonNull,
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

      // Revalidate caches
      revalidateTag("listings");
      revalidatePath("/profile/user-dashboard/[username]", "page");
      revalidatePath("/");

      return NextResponse.json(serializeListing(listing), { status: 201 });
    } catch (error: any) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "A listing with this ID already exists" },
          { status: 409 }
        );
      }
      console.error("Error processing request:", error);
      return NextResponse.json(
        { error: "Failed to create listing" },
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

// // app/api/postListing/route.ts
// import { auth } from "@/auth";
// import prisma from "@/prisma/client";
// import { NextResponse } from "next/server";
// import { revalidateTag, revalidatePath } from "next/cache";
// import { z } from "zod";
// import { Prisma } from "@prisma/client";

// // Validation schema
// const ListingSchema = z.object({
//   title: z.string().min(3, "Title must be at least 3 characters").max(100),
//   description: z
//     .string()
//     .min(30, "Description must be at least 30 characters")
//     .max(1500),
//   price: z
//     .number()
//     .positive("Price must be positive")
//     .max(1000000000, "Price cannot exceed 1,000,000,000"),
//   currency: z.string().default("XAF"),
//   town: z.string().min(1, "Town is required"),
//   address: z.string().min(1, "Address is required"),
//   subcategory_id: z.string().or(z.number()),
//   // Make profileImage truly optional
//   profileImage: z.string().url().optional().nullish(),
//   listingImages: z
//     .array(z.string().url())
//     .min(1, "At least one listing image is required")
//     .max(5),
//   timeline: z.string().optional(),
//   tags: z.array(z.string()).optional(),
//   condition: z.string().optional(),
//   negotiable: z.boolean().optional(),
//   delivery_available: z.boolean().optional(),
//   status: z.enum(["active", "inactive"]).default("inactive"),
// }).partial({ profileImage: true }); // This makes profileImage completely optional

// // Type for the listing response
// type ListingResponse = {
//   id: string;
//   title: string;
//   description: string;
//   price: number;
//   currency: string;
//   town: string;
//   address: string;
//   user_id: bigint;
//   images: string[] | null;
//   status: string;
//   timeline?: string;
//   subcategory_id: string;
//   tags?: string[];
//   condition?: string;
//   negotiable: string;
//   delivery_available: string;
//   created_at: string;
//   updated_at: string;
//   user?: {
//     id: bigint;
//     name: string | null;
//     email: string;
//     username: string | null;
//     profilImage: string | null;
//   };
// };

// // Serialization function
// function serializeListingForResponse(listing: any): ListingResponse {
//   return {
//     ...listing,
//     id: listing.id.toString(),
//     subcategory_id: listing.subcategory_id?.toString(),
//     negotiable: listing.negotiable?.toString(),
//     delivery_available: listing.delivery_available?.toString(),
//     created_at: listing.created_at?.toISOString(),
//     updated_at: listing.updated_at?.toISOString(),
//     user: listing.user
//       ? {
//           ...listing.user,
//           id: listing.user.id.toString(),
//         }
//       : undefined,
//   };
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
//       return NextResponse.json(
//         { error: "User account not found" },
//         { status: 404 }
//       );
//     }

//     // 3. Parse and validate request body
//     let body;
//     try {
//       body = await request.json();
//       await ListingSchema.parseAsync(body);
//     } catch (error) {
//       if (error instanceof z.ZodError) {
//         return NextResponse.json(
//           {
//             error: "Validation failed",
//             details: error.errors.map((err) => ({
//               field: err.path.join("."),
//               message: err.message,
//             })),
//           },
//           { status: 400 }
//         );
//       }
//       return NextResponse.json(
//         { error: "Invalid request data" },
//         { status: 400 }
//       );
//     }

//     try {
//       // Create listing with transaction
//       const listing = await prisma.$transaction(async (prisma) => {
//         // Update profile image if provided
//         if (body.profileImage) {
//           await prisma.user.update({
//             where: { id: user.id },
//             data: { profilImage: body.profileImage },
//           });
//         }

//         // Create the listing
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
//             images:
//               body.listingImages.length > 0
//                 ? body.listingImages
//                 : Prisma.JsonNull,
//             status: "inactive",
//             timeline: body.timeline,
//             subcategory_id: BigInt(body.subcategory_id),
//             tags: body.tags?.length > 0 ? body.tags : Prisma.JsonNull,
//             condition: body.condition,
//             negotiable: body.negotiable ? BigInt(1) : BigInt(0),
//             delivery_available: body.delivery_available ? BigInt(1) : BigInt(0),
//             created_at: new Date(),
//             updated_at: new Date(),
//           },
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

//         return newListing;
//       });

//       // Revalidate caches
//       revalidateTag("listings");
//       revalidatePath("/profile/user-dashboard/[username]", "page");
//       revalidatePath("/");

//       return NextResponse.json(serializeListingForResponse(listing), {
//         status: 201,
//       });
//     } catch (error: any) {
//       if (error.code === "P2002") {
//         return NextResponse.json(
//           { error: "A listing with this ID already exists" },
//           { status: 409 }
//         );
//       }
//       console.error("Error processing request:", error);
//       return NextResponse.json(
//         { error: "Failed to create listing" },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Error creating listing:", error);
//     return NextResponse.json(
//       { error: "Failed to create listing" },
//       { status: 500 }
//     );
//   }
// }

// export const dynamic = "force-dynamic";
