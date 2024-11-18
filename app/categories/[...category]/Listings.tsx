import { Suspense } from "react";
import ItemCard from "@/app/components/cards/ItemCard/ItemCard";
import Pagination from "@/app/components/Pagination";
import { generateSlides } from "@/utils/generateSlides";
import { getListings } from "@/utils/getListings";
import ItemCardSkeleton from "../../components/skeletons/ItemCardSkeleton";
import Hero from "./Hero";

interface Props {
  mainCategory: string;
  subCategory?: string;
  subSubCategory?: string;
  page: number;
  pageSize: number;
  location?: string;
  datePosted?: string;
  minPrice?: number;
  maxPrice?: number;
}

async function fetchListings(params: Props) {
  const { listings, totalCount } = await getListings(params);
  return { listings, totalCount };
}

const Listings = async (props: Props) => {
  const { page, pageSize } = props;
  const { listings, totalCount } = await fetchListings(props);

  return (
    <>
      {totalCount > 0 && (
        <h2 className="font-medium text-gray-500">
          {totalCount} {totalCount === 1 ? "listing" : "listings"} found
        </h2>
      )}

      <Hero />

      {listings.length === 0 ? (
        <div className="mt-10 text-center text-gray-500 text-xl">
          No listings found matching your criteria.
        </div>
      ) : (
        <>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense
              fallback={[...Array(pageSize)].map((_, index) => (
                <ItemCardSkeleton key={index} />
              ))}
            >
              {listings.map((listing) => (
                <div key={listing.id} className="mt-6">
                  <ItemCard
                    listing={listing}
                    slides={generateSlides(listing)}
                  />
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
      )}
    </>
  );
};

export default Listings;
