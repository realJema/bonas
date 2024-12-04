"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddReviewDialog } from "../AddReviewDialog/AddReviewDialog";
import { ReviewCard } from "../ReviewCard/ReviewCard";
import { INITIAL_DISPLAY_COUNT, useReviews } from "@/app/hooks/useReviews";
import { Review } from "@/app/types/review";

interface ReviewSectionProps {
  listingId: bigint;
  initialReviews?: Review[];
  totalReviews?: number;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export function ReviewSection({
  listingId,
  initialReviews = [],
  totalReviews = 0,
}: ReviewSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const {
    reviews,
    isLoading,
    error,
    hasMoreToShow,
    addReview,
    loadMore,
    sortReviews,
  } = useReviews(listingId, initialReviews);

  // Helper function to get display text for sort option
  const getSortDisplayText = (value: SortOption) => {
    const sortTexts = {
      newest: "Newest First",
      oldest: "Oldest First",
      highest: "Highest Rated",
      lowest: "Lowest Rated",
    };
    return sortTexts[value];
  };

  return (
    <div className="space-y-6 mt-3 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
          <p className="text-sm text-muted-foreground">
            {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <Select
            defaultValue="newest"
            value={sortBy}
            onValueChange={(value: SortOption) => {
              setSortBy(value);
              sortReviews(value);
            }}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue>{getSortDisplayText(sortBy)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>

          <AddReviewDialog
            listingId={listingId}
            onReviewAdded={(review) => {
              addReview(review);
            }}
          />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-4">
          <p className="text-sm text-destructive">
            {error}. Please try again later.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadMore()}
            className="mt-2"
          >
            Retry
          </Button>
        </div>
      )}

      <div className="space-y-6">
        {reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            onReplyAdded={(reply) => {
              const updatedReviews = reviews.map((r) =>
                r.id === review.id
                  ? {
                      ...r,
                      replies: [...(r.replies || []), reply],
                      _count: {
                        ...r._count,
                        replies: (r._count?.replies || 0) + 1,
                      },
                    }
                  : r
              );
              sortReviews(sortBy, updatedReviews);
            }}
          />
        ))}

        {hasMoreToShow && reviews.length >= INITIAL_DISPLAY_COUNT && (
          <div className="flex justify-center py-4">
            <Button onClick={loadMore} disabled={isLoading} variant="outline">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                "Load More Reviews"
              )}
            </Button>
          </div>
        )}

        {!hasMoreToShow && reviews.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            No more reviews to load
          </p>
        )}

        {!isLoading && reviews.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
