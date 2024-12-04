// hooks/useReviews.ts
import { createReview, getReviews } from "@/actions/createReview";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Review, ReviewFormData } from "../types/review";

 export const INITIAL_DISPLAY_COUNT = 5;

export function useReviews(listingId: bigint, initialReviews: Review[] = []) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [visibleCount, setVisibleCount] = useState(INITIAL_DISPLAY_COUNT);
  const { data: session } = useSession();

  const sortReviews = useCallback(
    (sortBy: string, updatedReviews?: Review[]) => {
      const reviewsToSort = [...(updatedReviews || reviews)];

      reviewsToSort.sort((a, b) => {
        switch (sortBy) {
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "highest":
            return b.rating - a.rating;
          case "lowest":
            return a.rating - b.rating;
          default: 
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
        }
      });

      setReviews(reviewsToSort);
    },
    [reviews]
  );

const addReview = async (review: Review) => {
  if (!session?.user?.name || !session?.user?.id) {
    setError("Must be logged in to review");
    return;
  }

  const optimisticReview: Review = {
    id: Date.now(),
    listingId: review.listingId,
    userId: session.user.id,
    rating: review.rating,
    comment: review.comment,
    createdAt: new Date(),
    user: {
      name: session.user.name || "",
      image: session.user.image || "/default-avatar.png",
    },
    _count: {
      replies: 0,
    },
  };

  setReviews((prev) => [optimisticReview, ...prev]);

  try {
    const formData: ReviewFormData = {
      listingId: review.listingId,
      rating: review.rating,
      comment: review.comment,
    };

    const result = await createReview(formData);
    if (result.error) throw new Error(result.error);
    if (!result.review) throw new Error("No review returned");

    const normalizedReview: Review = {
      id: result.review.id,
      listingId: result.review.listingId,
      userId: result.review.userId,
      rating: result.review.rating,
      comment: result.review.comment || "",
      createdAt: result.review.createdAt,
      parentId: result.review.parentId || undefined,
      user: {
        name: result.review.user.name || "",
        image: result.review.user.image || "/default-avatar.png",
      },
      _count: {
        replies: 0,
      },
    };

    setReviews((prev) =>
      prev.map((r) => (r.id === optimisticReview.id ? normalizedReview : r))
    );
  } catch (err) {
    setReviews((prev) => prev.filter((r) => r.id !== optimisticReview.id));
    setError("Failed to add review");
  }
};

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = visibleCount + INITIAL_DISPLAY_COUNT;
      setVisibleCount(nextPage);

      if (nextPage >= reviews.length && hasMore) {
        const result = await getReviews({
          listingId,
          cursor,
          take: 10,
        });

        if (result.error) throw new Error(result.error);
        if (!result.reviews?.length) {
          setHasMore(false);
          return;
        }

        const normalizedReviews = result.reviews.map((review) => ({
          id: review.id,
          listingId: review.listingId,
          userId: review.userId,
          rating: review.rating,
          comment: review.comment || "",
          createdAt: review.createdAt,
          parentId: review.parentId || undefined,
          user: {
            name: review.user.name || "",
            image: review.user.image || "/default-avatar.png",
          },
          _count: review._count || { replies: 0 },
        }));

        setReviews((prev) => [...prev, ...normalizedReviews]);
        setCursor(normalizedReviews[normalizedReviews.length - 1]?.id);
        setHasMore(normalizedReviews.length === 10);
      }
    } catch (err) {
      setError("Failed to load more reviews");
    } finally {
      setIsLoading(false);
    }
  }, [cursor, hasMore, isLoading, listingId, reviews.length, visibleCount]);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMoreToShow = reviews.length > visibleCount || hasMore;

  return {
    reviews: visibleReviews,
    isLoading,
    error,
    hasMoreToShow,
    addReview,
    loadMore,
    sortReviews,
  };
}
