"use client";

import ItemCard from "@/app/components/ItemCard";
import Pagination from "@/app/components/Pagination";
import LevelBadge from "@/app/components/badges/Levelbadge";
import TopRatedBadge from "@/app/components/badges/TopRatedBadge";
import ProBadge from "@/app/components/badges/Probadge";
import prisma from "@/prisma/client";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { generateSlides } from "@/lib/generateSlides";
import Hero from "./Hero";


interface Props {
  page: string;
  listings: ExtendedListing[];
  totalCount: number;
}

const Listings = ({ page, listings, totalCount }: Props) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = 9;

  console.log("Current page:", currentPage);
  console.log("Total items:", totalCount);
  console.log("Items on this page:", listings.length);

  return (
    <>
      {/* description */}
      <p className="text-lg text-gray-500 mt-4">
        {}description of listing category will go here
      </p>

      {/* category hero */}
      <Hero />

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing, index) => (
          <div key={index} className="mt-6">
            <ItemCard listing={listing} slides={generateSlides(listing)} />
          </div>
        ))}
      </div>
      <div className="mt-20">
        <Pagination
          itemCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
        />
      </div>
    </>
  );
};

export default Listings;
