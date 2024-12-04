"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import prisma from "@/prisma/client";
import { ReviewFormData } from "@/app/types/review";


export async function createReview(formData: ReviewFormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  try {
    const review = await prisma.review.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        listingId: formData.listingId,
        rating: formData.rating,
        comment: formData.comment,
        ...(formData.parentId && { parentId: formData.parentId }),
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath("/");
    return { review };
  } catch (error) {
     console.error("Review creation error:", error);
    return { error: "Failed to create review" };
  }
}

export async function getReviews(params: {
  listingId: bigint;
  cursor?: number;
  take: number;
}) {
  try {
    const [reviews, replyCounts] = await Promise.all([
      prisma.review.findMany({
        where: {
          listingId: params.listingId,
          parentId: null,
        },
        take: params.take,
        skip: params.cursor ? 1 : 0,
        cursor: params.cursor ? { id: params.cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.review.groupBy({
        by: ["parentId"],
        where: {
          parentId: { not: null },
        },
        _count: {
          id: true,
        },
      }),
    ]);

    const reviewsWithCount = reviews.map((review) => ({
      ...review,
      _count: {
        replies:
          replyCounts.find((count) => count.parentId === review.id)?._count
            .id || 0,
      },
    }));

    return { reviews: reviewsWithCount };
  } catch (error) {
    return { error: "Failed to load reviews" };
  }
}

// Add reply functionality
export async function addReply(
  formData: ReviewFormData & { parentId: number }
) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }

  try {
    const reply = await prisma.review.create({
      data: {
        user: {
          connect: {
            id: session.user.id,
          },
        },
        listingId: formData.listingId,
        comment: formData.comment,
        parentId: formData.parentId,
        rating: 0,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/listings/${formData.listingId}`);
    return { reply };
  } catch (error) {
    return { error: "Failed to add reply" };
  }
}
