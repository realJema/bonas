import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FooterSkeleton = () => {
  return (
    <footer className="mt-20 container md:max-w-7xl py-10 px-4 sm:px-6 lg:px-8 mx-auto border-t">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        {[...Array(5)].map((_, index) => (
          <div key={index}>
            <Skeleton width={120} height={20} className="mb-4" />
            <div className="mt-3 grid space-y-3">
              {[...Array(6)].map((_, subIndex) => (
                <Skeleton key={subIndex} width={100} height={16} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="flex items-center gap-x-3">
            <Skeleton width={40} height={40} />
            <Skeleton width={200} height={20} />
          </div>
          <div className="flex justify-between items-center mt-3 sm:mt-0">
            <div className="space-x-4">
              <Skeleton width={24} height={24} className="inline-block" />
              <Skeleton width={24} height={24} className="inline-block" />
              <Skeleton width={24} height={24} className="inline-block" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterSkeleton;