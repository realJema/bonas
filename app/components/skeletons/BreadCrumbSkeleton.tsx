import { ChevronRight, Home } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const BreadCrumbsSkeleton = () => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 sm:py-4 md:py-5">
      <ol className="flex flex-wrap items-center text-sm sm:text-base md:text-lg">
        <li className="flex items-center">
          <Home
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
            aria-hidden="true"
          />
          <span className="sr-only">Home</span>
        </li>
        <li className="flex items-center">
          <CustomSeparator />
          <Skeleton width={80} height={20} className="capitalize" />
        </li>
        <li className="flex items-center">
          <CustomSeparator />
          <Skeleton width={80} height={20} className="capitalize" />
        </li>
        <li className="flex items-center">
          <CustomSeparator />
          <Skeleton
            width={100}
            height={20}
            className="capitalize font-semibold"
          />
        </li>
      </ol>
    </nav>
  );
};

const CustomSeparator = () => (
  <ChevronRight
    className="mx-2 h-4 w-4 sm:mx-3 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0"
    aria-hidden="true"
  />
);

export default BreadCrumbsSkeleton;
