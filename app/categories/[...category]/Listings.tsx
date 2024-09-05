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
   page: string 
   listings: ExtendedListing[]
}



const Listings = ({ page , listings }: Props) => {

  const currentPage = parseInt(page) || 1;
   const pageSize = 9;
   const totalItems = listings.length;

   console.log("Current page:", currentPage);
   console.log("Total items:", totalItems);

   const startIndex = (currentPage - 1) * pageSize;
   const endIndex = Math.min(startIndex + pageSize, totalItems);
   const currentListings = listings.slice(startIndex, endIndex);


  return (
    <>
      {/* description */}
      <p className="text-lg text-gray-500 mt-4">{}</p>

      {/* category hero */}
      <Hero />

      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentListings.map((listing, index) => (
          <div key={index} className="mt-6">
            <ItemCard listing={listing} slides={generateSlides(listing)} />
          </div>
        ))}
      </div>
      <div className="mt-20">
        <Pagination
          itemCount={totalItems}
          pageSize={pageSize}
          currentPage={currentPage}
        />
      </div>
    </>
  );
};

export default Listings;
