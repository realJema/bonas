import React from "react";
import { auth } from "@/auth";
import ProfileCard from "./UserProfileCard";
import LearnmoreCard from "./LearnMoreCard";
import DescriptionCard from "./DescriptionCard";
import Header from "@/app/components/Header";
import { getListingsByUserId } from "@/utils/getListingsByUserId";
import ItemCard from "@/app/components/ItemCard";
import { generateSlides } from "@/lib/generateSlides";
import Pagination from "@/app/components/Pagination";

interface Props {
  params: { username: string };
  searchParams: { page?: string };
}

const UserProfilePage = async ({ params: { username }, searchParams }: Props) => {
  const session = await auth();

  const userId = session?.user?.id;
  const pageSize = 9;
  const currentPage = parseInt(searchParams.page || "1");


  // Fetch user's listings
  const { listings, totalCount } = await getListingsByUserId({
    userId: "01J66X60M7TKEBSPPZN07TJ5MG",
    page: currentPage,
    pageSize: pageSize,
  });

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 container mx-auto px-4 pt-6 md:px-0 md:max-w-7xl">
        <div className="lg:col-span-1 space-y-6 p-2 md:px-10 md:py-5">
          <ProfileCard
            name={session?.user?.name || ""}
            username={username}
            location="Cameroon"
            memberSince="Sep 2021"
            isNew={true}
            isOnline={true}
            imageUrl={session?.user?.image}
          />

          <LearnmoreCard
            title="Earn badges and stand out"
            description="Boost your sales by boosting your expertise."
            buttonText="Enroll Now"
          />
          <div className="">
            <DescriptionCard
              description="A frontend developer crafts user-friendly interfaces with code magic. He does amazing things to ensure great UI design and goes through lengths to link the front end and the back end"
              languages={[{ language: "English", level: "Basic" }]}
              skills={["Google Voice"]}
            />
          </div>
        </div>
        <div className="lg:col-span-2">
          {totalCount > 0 && (
            <h2 className="font-medium text-gray-500 px-4">
              {totalCount} {totalCount === 1 ? "listing" : "listings"} found
            </h2>
          )}

          <div>
            {listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
                  {listings.map((listing) => (
                    <ItemCard
                      key={listing.id}
                      listing={listing}
                      slides={generateSlides(listing)}
                    />
                  ))}
                </div>
                <div className="mt-10">
                  {totalCount > pageSize && (
                    <Pagination
                      itemCount={totalCount}
                      pageSize={pageSize}
                      currentPage={currentPage}
                    />
                  )}
                </div>
              </>
            ) : (
              <p>No listings found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
