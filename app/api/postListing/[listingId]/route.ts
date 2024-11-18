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
      : null,
  };
}

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

export async function PUT(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

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

    const body = await request.json();

    try {
      let profileImageUrl: string | undefined;
      let coverImageUrl: string | undefined;
      let additionalImages: string[] = [];

      if (body.profileImage && body.profileImage.startsWith("data:image/")) {
        try {
          profileImageUrl = await uploadToCloudinary(
            body.profileImage,
            "profile"
          );
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to upload profile image" },
            { status: 400 }
          );
        }
      }

      if (body.cover_image && body.cover_image.startsWith("data:image/")) {
        try {
          coverImageUrl = await uploadToCloudinary(body.cover_image, "cover");
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to upload cover image" },
            { status: 400 }
          );
        }
      }

      if (body.images && body.images.length > 0) {
        try {
          additionalImages = await Promise.all(
            body.images.map((image: string) =>
              image.startsWith("data:image/")
                ? uploadToCloudinary(image, "additional")
                : image
            )
          );
        } catch (error) {
          return NextResponse.json(
            { error: "Failed to upload additional images" },
            { status: 400 }
          );
        }
      }

      const imagesData:
        | Prisma.InputJsonValue
        | Prisma.NullableJsonNullValueInput =
        additionalImages.length > 0
          ? additionalImages
          : existingListing.images || Prisma.JsonNull;

      const tagsData:
        | Prisma.InputJsonValue
        | Prisma.NullableJsonNullValueInput =
        body.tags?.length > 0 ? body.tags : Prisma.JsonNull;

      const [updatedUser, updatedListing] = await prisma.$transaction([
        profileImageUrl
          ? prisma.user.update({
              where: { id: user.id },
              data: { profilImage: profileImageUrl },
            })
          : prisma.user.findUnique({ where: { id: user.id } }),

        prisma.listing.update({
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
            timeline: body.timeline,
            subcategory_id: BigInt(body.subcategory_id),
            cover_image: coverImageUrl || existingListing.cover_image,
            images: imagesData,
            tags: tagsData,
            condition: body.condition,
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
                image: true,
                username: true,
                profilImage: true,
              },
            },
          },
        }),
      ]);

      revalidateTag("listings");
      revalidatePath("/profile/user-dashboard/[username]", "page");


      return NextResponse.json(serializeListing(updatedListing), {
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
      throw error;
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
