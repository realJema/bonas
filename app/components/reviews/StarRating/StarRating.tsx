// components/StarRating/StarRating.tsx
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  readOnly?: boolean;
}

const ratingDescriptions = {
  1: { label: "Poor", color: "text-red-400" },
  2: { label: "Fair", color: "text-orange-400" },
  3: { label: "Good", color: "text-yellow-400" },
  4: { label: "Very Good", color: "text-lime-400" },
  5: { label: "Excellent", color: "text-green-400" },
};

export function StarRating({
  rating,
  setRating,
  disabled,
  size = "md",
  showTooltip = true,
  readOnly = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const handleStarClick = (value: number) => {
    if (!disabled && !readOnly) {
      setRating(value === rating ? 0 : value); // Allow unrating by clicking again
    }
  };

  const StarButton = ({ value }: { value: number }) => {
    const isActive = value <= (hoverRating || rating);
    const { label, color } =
      ratingDescriptions[value as keyof typeof ratingDescriptions];

    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled={disabled || readOnly}
              className={cn(
                "relative transition-all duration-200 touch-none",
                "hover:scale-110 active:scale-95",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "sm:hover:scale-110", // Only scale on hover for non-touch devices
                isActive && "animate-jump-in"
              )}
              onMouseEnter={() => !readOnly && setHoverRating(value)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              onClick={() => handleStarClick(value)}
              aria-label={`Rate ${value} out of 5 (${label})`}
            >
              {/* Background star */}
              <svg
                className={cn(
                  sizeClasses[size],
                  "transform fill-current",
                  "text-gray-200 dark:text-gray-700"
                )}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                  strokeWidth="2"
                />
              </svg>

              {/* Filled star overlay */}
              <svg
                className={cn(
                  "absolute inset-0",
                  sizeClasses[size],
                  "transform fill-current transition-transform duration-200",
                  isActive ? "opacity-100" : "opacity-0",
                  disabled ? "text-gray-400" : color
                )}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
            </button>
          </TooltipTrigger>
          {showTooltip && (
            <TooltipContent
              side="top"
              className="bg-gray-800 text-white px-2 py-1 text-xs rounded"
            >
              {label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <StarButton key={value} value={value} />
        ))}
      </div>

      {/* Rating text - Only show on mobile or when tooltips are disabled */}
      {rating > 0 && (
        <span
          className={cn(
            "text-sm font-medium",
            ratingDescriptions[rating as keyof typeof ratingDescriptions].color
          )}
        >
          {ratingDescriptions[rating as keyof typeof ratingDescriptions].label}
          <span className="text-gray-500 ml-1">({rating} of 5)</span>
        </span>
      )}
    </div>
  );
}
