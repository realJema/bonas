import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createReview } from "@/actions/createReview";
import { useToast } from "@/hooks/use-toast";
import { StarRating } from "../StarRating/StarRating";
import { ReviewFormData } from "@/app/types/review";
import { Review } from "@/app/types/review";

interface AddReviewDialogProps {
  listingId: bigint;
  onReviewAdded: (review: Review) => void;
}

export function AddReviewDialog({
  listingId,
  onReviewAdded,
}: AddReviewDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!rating || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      const formData: ReviewFormData = {
        listingId: listingId,
        rating: rating,
        comment: comment.trim(),
      };

      const result = await createReview(formData);
      if (result.error) throw new Error(result.error);
      if (!result.review) throw new Error("No review returned");

      // Normalize the review data before passing it
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

      onReviewAdded(normalizedReview);
      setIsOpen(false);
      toast({
        title: "Success!",
        description: "Your review has been submitted.",
        variant: "success",
        className: "bg-green-50 border-green-200",
        // titleClassName: "text-green-800",
        // descriptionClassName: "text-green-600"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setRating(0);
    setComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Write a Review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] p-4">
        <DialogHeader>
          <DialogTitle>Write Your Review</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center">
            <StarRating
              rating={rating}
              setRating={setRating}
              size="lg"
              showTooltip={true}
              disabled={isSubmitting}
            />
          </div>
          <Textarea
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            disabled={isSubmitting}
            className="min-h-[100px] resize-none"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !rating || !comment.trim()}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
