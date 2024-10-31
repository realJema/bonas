import Footer from "@/app/components/sections/Footer/Footer";
import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ItemCardSkeleton from "../../components/skeletons/ItemCardSkeleton";

const SkeletonFilterDropdown = () => (
  <div className="w-full">
    <Skeleton height={40} />
  </div>
);

const Loading = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pt-10">
        {/* Mobile filters */}
        <div className="md:hidden flex overflow-x-auto space-x-6 pb-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex-shrink-0 w-40">
              <SkeletonFilterDropdown />
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden md:block md:w-64">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex flex-col space-y-6 pb-6">
                <Skeleton height={40} /> {/* Search */}
                {[1, 2].map((i) => (
                  <SkeletonFilterDropdown key={i} />
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-5">
            <Skeleton width={300} height={20} /> {/* BreadCrumbs */}
            <Skeleton height={150} className="mt-4" /> {/* Hero */}
            {/* Listings */}
            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="mt-6">
                  <ItemCardSkeleton />
                </div>
              ))}
            </div>
            {/* pagination */}
            <div className="mt-20">
              <div className="flex items-center justify-center space-x-4">
                {/* Previous page button */}
                <Skeleton circle width={40} height={40} />

                {/* Page numbers */}
                {[...Array(7)].map((_, index) => (
                  <Skeleton key={index} width={32} height={32} />
                ))}

                {/* Next page button */}
                <Skeleton circle width={40} height={40} />
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Loading;
