
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeaderSkeleton = () => {
  return (
    <header className="hidden md:block border-b xl:px-0 relative h-14">
      <div className="hidden sm:block container mx-auto md:max-w-7xl relative h-full">
        <div className="relative h-full flex items-center justify-center">
          <div className="overflow-x-auto whitespace-nowrap scrollbar-hide px-6">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="inline-flex mr-6 last:mr-0">
                <Skeleton width={100} height={18} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sm:hidden p-4">
        <Skeleton height={40} />
      </div>
    </header>
  );
};

export default HeaderSkeleton;
