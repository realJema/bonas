import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const IconRowSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
      <Skeleton width={24} height={24} circle />

      <Skeleton width={20} height={20} circle />

      <div className="bg-white border border-gray-300 p-1 sm:p-2 rounded-md">
        <Skeleton width={16} height={16} />
      </div>

      <div className="bg-white border border-gray-300 p-1 sm:p-2 rounded-md">
        <Skeleton width={16} height={16} />
      </div>
    </div>
  );
};

export default IconRowSkeleton;
