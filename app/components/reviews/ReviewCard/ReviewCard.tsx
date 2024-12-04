// components/reviews/ReviewCard.tsx
import { useState } from "react";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReviewFormData } from "@/app/types/review";
import { createReview } from "@/actions/createReview";
import { useAuth } from "@/app/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Review } from "@/app/types/review";

interface ReviewCardProps {
  review: Review;
  depth?: number;
  onReplyAdded?: (reply: Review) => void;
  className?: string;
}

const MAX_DEPTH = 3;
const INITIAL_REPLIES_SHOWN = 2;

export function ReviewCard({
  review,
  depth = 0,
  onReplyAdded,
  className,
}: ReviewCardProps) {
  const { user } = useAuth();
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const hasReplies = review.replies && review.replies.length > 0;
  const replyCount = review._count?.replies || 0;
  const canReply = depth < MAX_DEPTH && user;

  const visibleReplies = showAllReplies
    ? review.replies
    : review.replies?.slice(0, INITIAL_REPLIES_SHOWN);

  const handleReply = async () => {
    if (!replyText.trim() || !user) return;

    setIsSubmitting(true);
    try {
      const formData: ReviewFormData = {
        listingId: review.listingId,
        rating: 0,
        comment: replyText.trim(),
        parentId: review.id,
      };

      const result = await createReview(formData);
      if (result.error) throw new Error(result.error);
      if (!result.review) throw new Error("No review returned");

      const normalizedReply: Review = {
        ...result.review,
        comment: result.review.comment || "",
        user: {
          name: result.review.user.name || "",
          image: result.review.user.image || "",
        },
        _count: { replies: 0 },
        parentId: result.review.parentId || undefined,
      };

      onReplyAdded?.(normalizedReply);
      setReplyText("");
      setIsReplying(false);
      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
        variant: "success",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-lg bg-white p-4 shadow-sm",
        depth > 0 && "ml-0 pl-8 border-l border-gray-200",
        className
      )}
    >
      {depth > 0 && (
        <div className="absolute left-0 top-8 w-6 h-px bg-gray-200" />
      )}
      <div className="flex gap-4">
        <div className="relative h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
          {review.user.image ? (
            <Image
              src={review.user.image}
              alt={review.user.name}
              fill
              sizes="(max-width: 640px) 32px, 40px"
              className="rounded-full object-cover"
              priority={false}
            />
          ) : (
            <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xs sm:text-sm font-medium">
                {review.user.name?.charAt(0).toUpperCase() || "U"}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold truncate">{review.user.name}</h4>
            {review.rating > 0 && (
              <div className="flex flex-shrink-0">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3 sm:h-4 sm:w-4",
                      i < review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-gray-500">
            {formatDistance(new Date(review.createdAt), new Date(), {
              addSuffix: true,
            })}
          </p>

          <p className="mt-2 text-sm sm:text-base text-gray-700 whitespace-pre-line">
            {review.comment}
          </p>

          {canReply && (
            <div className="mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsReplying(!isReplying)}
              >
                Reply
              </Button>
            </div>
          )}

          {isReplying && (
            <div className="mt-4 space-y-2">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your reply..."
                disabled={isSubmitting}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleReply}
                  disabled={isSubmitting || !replyText.trim()}
                >
                  {isSubmitting ? "Posting..." : "Post Reply"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsReplying(false);
                    setReplyText("");
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {hasReplies && (
            <div className="mt-4 space-y-4">
              {visibleReplies?.map((reply) => (
                <ReviewCard
                  key={reply.id}
                  review={reply}
                  depth={depth + 1}
                  onReplyAdded={onReplyAdded}
                />
              ))}

              {replyCount > INITIAL_REPLIES_SHOWN && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllReplies(!showAllReplies)}
                  className="ml-4"
                >
                  {showAllReplies ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      Show {replyCount - INITIAL_REPLIES_SHOWN} More{" "}
                      {replyCount - INITIAL_REPLIES_SHOWN === 1
                        ? "Reply"
                        : "Replies"}
                    </>
                  )}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
