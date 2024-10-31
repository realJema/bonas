import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const HeroSkeleton = () => {
  return (
    <section className="hero mt-16 md:mt-24 xl:mt-16 h-full py-10 rounded-2xl text-white relative">
      <div className="absolute inset-0 z-[-1]">
        <Skeleton height="100%" width="100%" borderRadius="1rem" />
      </div>
      <div className="relative z-10">
        <div className="mb-8 px-8">
          <Skeleton height={40} width={300} />
        </div>

        <div className="hidden xl:flex items-center gap-4 w-full px-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex-1">
              <div className="flex items-center gap-4 bg-white bg-opacity-20 p-4 rounded-lg">
                <Skeleton circle width={64} height={64} />
                <div className="flex-grow">
                  <Skeleton height={20} width="80%" />
                  <Skeleton height={16} width="60%" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="xl:hidden px-4 md:px-8">
          <div className="flex justify-end mb-2.5">
            <div className="flex gap-2">
              <Skeleton width={40} height={40} borderRadius="50%" />
              <Skeleton width={40} height={40} borderRadius="50%" />
            </div>
          </div>

          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex-shrink-0 w-3/4">
                <div className="flex items-center gap-4 bg-white bg-opacity-20 p-4 rounded-lg">
                  <Skeleton circle width={64} height={64} />
                  <div className="flex-grow">
                    <Skeleton height={20} width="80%" />
                    <Skeleton height={16} width="60%" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;
