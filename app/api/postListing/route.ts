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
      revalidatePath("/profile/user-dashboard/[username]", "page");
      revalidatePath("/");

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
