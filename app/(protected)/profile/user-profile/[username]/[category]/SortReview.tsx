"use client";

import ReviewSort, { ReviewSortType } from "@/app/components/ReviewSort";

interface Props {
  className?: string;
}

const SortReview = ({ className }: Props) => {
  const handleSortChange = (sortValue: ReviewSortType) => {
    console.log("Sort changed to:", sortValue);
  };

  return (
    <div className={`${className}`}>
      <ReviewSort onSortChange={handleSortChange} currentSort="newest" />
    </div>
  );
};

export default SortReview;
