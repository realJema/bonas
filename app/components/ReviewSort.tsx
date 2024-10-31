"use client";

import React from "react";
import { Check, ChevronDown, Clock, Star, ThumbsUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type ReviewSortType =
  | "newest"
  | "oldest"
  | "highest_rating"
  | "lowest_rating"
  | "most_helpful";

interface ReviewSortOption {
  value: ReviewSortType;
  label: string;
  icon: React.ReactNode;
}

const sortOptions: ReviewSortOption[] = [
  {
    value: "newest",
    label: "Newest Reviews",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: "oldest",
    label: "Oldest Reviews",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    value: "highest_rating",
    label: "Highest Rating",
    icon: <Star className="h-4 w-4" />,
  },
  {
    value: "lowest_rating",
    label: "Lowest Rating",
    icon: <Star className="h-4 w-4" />,
  },
  {
    value: "most_helpful",
    label: "Most Helpful",
    icon: <ThumbsUp className="h-4 w-4" />,
  },
];

interface ReviewSortProps {
  onSortChange: (value: ReviewSortType) => void;
  currentSort?: ReviewSortType;
  className?: string;
}

const ReviewSort = ({
  onSortChange,
  currentSort = "newest",
  className,
}: ReviewSortProps) => {
  const selectedOption =
    sortOptions.find((option) => option.value === currentSort) ||
    sortOptions[0];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-sm font-medium"
          >
            Sort by
            <span className="flex items-center gap-1.5">
              {selectedOption.icon}
              {selectedOption.label}
            </span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {sortOptions.map((option, index) => (
            <React.Fragment key={option.value}>
              {index > 0 && index % 2 === 0 && <DropdownMenuSeparator />}
              <DropdownMenuItem
                className="flex items-center justify-between py-2 px-3 cursor-pointer"
                onClick={() => onSortChange(option.value)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{option.icon}</span>
                  <span>{option.label}</span>
                </div>
                {currentSort === option.value && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            </React.Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ReviewSort;
