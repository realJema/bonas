import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCard = () => (
  <div className="flex flex-col gap-1 mt-1 p-1">
    <Skeleton height={125} /> {/* Image placeholder */}
    <div className="flex items-center justify-between">
      <div className="flex gap-1 items-center">
        <Skeleton circle width={27} height={27} /> {/* User profile picture */}
        <Skeleton width={100} /> {/* Username */}
      </div>
      <Skeleton width={80} /> {/* Date posted */}
    </div>
    <Skeleton width={200} /> {/* Title */}
    <div className="font-bold flex items-center gap-2 px-1 py-0.5">
      <Skeleton width={20} height={20} /> {/* Star icon */}
      <Skeleton width={100} /> {/* Rating */}
    </div>
    <Skeleton width={150} /> {/* Price */}
  </div>
);

export default SkeletonCard;
