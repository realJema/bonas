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
import { Progress } from "@/components/ui/progress";
import { AddReviewDialog } from "../AddReviewDialog/AddReviewDialog";
import { ReviewCard } from "../ReviewCard/ReviewCard";
import { INITIAL_DISPLAY_COUNT, useReviews } from "@/app/hooks/useReviews";
import { Review } from "@/app/types/review";
import { StarRating } from "../StarRating/StarRating";

interface ReviewSectionProps {
  listingId: bigint;
  initialReviews?: Review[];
  totalReviews?: number;
  className?: string;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export function ReviewSection({
  listingId,
  initialReviews = [],
  totalReviews = 0,
  className = "",
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

  // Calculate review statistics
  const calculateReviewStats = () => {
    if (!reviews.length)
      return { averageRating: 0, starCounts: new Array(5).fill(0) };

    const starCounts = new Array(5).fill(0);
    let totalRating = 0;

    reviews.forEach((review) => {
      if (review.rating > 0) {
        totalRating += review.rating;
        starCounts[review.rating - 1]++;
      }
    });

    const averageRating = totalRating / reviews.length;
    return { averageRating, starCounts };
  };

  const { averageRating, starCounts } = calculateReviewStats();

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
    <>
      {/* Review Summary Section */}
      <div className={`${className}`}>
        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Reviews</h1>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"} for
              this Listing
            </p>
            <div className="flex items-center">
              <StarRating
                rating={Math.round(averageRating)}
                setRating={() => {}}
                readOnly
                showTooltip={false}
              />
              <span className="ml-2 text-xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-4">
                  <span
                    className={`font-medium text-sm w-16 ${
                      starCounts[stars - 1] === 0
                        ? "text-gray-400"
                        : "text-gray-900"
                    }`}
                  >
                    {stars} Stars
                  </span>
                  <Progress
                    value={
                      totalReviews > 0
                        ? (starCounts[stars - 1] / totalReviews) * 100
                        : 0
                    }
                    className={`flex-grow h-2 ${
                      starCounts[stars - 1] === 0 ? "bg-gray-200" : ""
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      starCounts[stars - 1] === 0
                        ? "text-gray-300"
                        : "text-gray-900"
                    }`}
                  >
                    ({starCounts[stars - 1]})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-3 max-w-4xl mx-auto px-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Reviews</h2>
            <p className="text-sm text-muted-foreground">
              {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
            </p>
          </div> */}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4 w-full">
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
    </>
  );
}
