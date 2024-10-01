import React, { Suspense } from "react";
import ItemCard from "@/app/components/ItemCard";
import Pagination from "@/app/components/Pagination";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { generateSlides } from "@/lib/generateSlides";
import { getListings } from "@/utils/getListings";
import SkeletonCard from "./SkeletonCard";

interface Props {
  mainCategory: string;
  subCategory?: string;
  subSubCategory?: string;
  page: number;
  pageSize: number;
  location?: string;
  datePosted?: string;
}

const Listings = async ({
  mainCategory,
  subCategory,
  subSubCategory,
  page,
  pageSize,
  location,
  datePosted,
}: Props) => {
  // console.log("Listings component received props:", {
  //   mainCategory,
  //   subCategory,
  //   subSubCategory,
  //   page,
  //   pageSize,
  //   location,
  //   datePosted,
  // });

  const { listings, totalCount } = await getListings({
    mainCategory,
    subCategory,
    subSubCategory,
    page,
    pageSize,
    location,
    datePosted,
  });

  return (
    <>
      <p className="text-lg text-gray-500 mt-4">
        {/* description of listing category will go here */}
      </p>

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense
          fallback={[...Array(pageSize)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        >
          {listings.map((listing, index) => (
            <div key={index} className="mt-6">
              <ItemCard listing={listing} slides={generateSlides(listing)} />
            </div>
          ))}
        </Suspense>
      </div>
      <div className="mt-20">
        {totalCount > pageSize && (
          <Pagination
            itemCount={totalCount}
            pageSize={pageSize}
            currentPage={page}
          />
        )}
      </div>
    </>
  );
};

export default Listings;
