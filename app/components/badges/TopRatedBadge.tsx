"use client";

import React from "react";

const TopRatedBadge = () => {
  return (
    <div className="bg-amber-300 bg-opacity-50 p-1 rounded-md flex items-center gap-1">
      <span className="text-amber-800 font-semibold text-sm">Top Rated</span>
      <div className="inline-flex items-center gap-0.5 text-amber-900">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 10"
          width="10"
          height="10"
          fill="currentColor"
          className="inline-block text-amber-900"
        >
          <path d="M4.839.22a.2.2 0 0 1 .322 0l1.942 2.636a.2.2 0 0 0 .043.043L9.782 4.84a.2.2 0 0 1 0 .322L7.146 7.105a.2.2 0 0 0-.043.043L5.161 9.784a.2.2 0 0 1-.322 0L2.897 7.148a.2.2 0 0 0-.043-.043L.218 5.163a.2.2 0 0 1 0-.322l2.636-1.942a.2.2 0 0 0 .043-.043L4.839.221Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 10"
          width="10"
          height="10"
          fill="currentColor"
          className="inline-block text-amber-900"
        >
          <path d="M4.839.22a.2.2 0 0 1 .322 0l1.942 2.636a.2.2 0 0 0 .043.043L9.782 4.84a.2.2 0 0 1 0 .322L7.146 7.105a.2.2 0 0 0-.043.043L5.161 9.784a.2.2 0 0 1-.322 0L2.897 7.148a.2.2 0 0 0-.043-.043L.218 5.163a.2.2 0 0 1 0-.322l2.636-1.942a.2.2 0 0 0 .043-.043L4.839.221Z"></path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 10 10"
          width="10"
          height="10"
          fill="currentColor"
          className="inline-block text-amber-900"
        >
          <path d="M4.839.22a.2.2 0 0 1 .322 0l1.942 2.636a.2.2 0 0 0 .043.043L9.782 4.84a.2.2 0 0 1 0 .322L7.146 7.105a.2.2 0 0 0-.043.043L5.161 9.784a.2.2 0 0 1-.322 0L2.897 7.148a.2.2 0 0 0-.043-.043L.218 5.163a.2.2 0 0 1 0-.322l2.636-1.942a.2.2 0 0 0 .043-.043L4.839.221Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default TopRatedBadge;
