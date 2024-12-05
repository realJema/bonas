import React from "react";
import { auth } from "@/auth";
import ProfileCard from "./UserProfileCard";
import LearnmoreCard from "./LearnMoreCard";
import DescriptionCard from "./DescriptionCard";
import { getListingsByUserId } from "@/utils/getListingsByUserId";
import ItemCard from "@/app/components/cards/ItemCard/ItemCard";
import { generateSlides } from "@/utils/generateSlides";
import Pagination from "@/app/components/Pagination";
import Header from "@/app/components/sections/Header/Header";

interface Props {
  params: { username: string };
  searchParams: { page?: string };
}

const UserProfilePage = async ({
  params: { username },
  searchParams,
}: Props) => {
  const session = await auth();

  const userId = session?.user!.id;
  const pageSize = 9;
  const currentPage = parseInt(searchParams.page || "1");

  // Fetch user's listings
  const { listings, totalCount } = await getListingsByUserId({
    userId: userId || "",
    page: currentPage,
    pageSize: pageSize,
  });

  return (
    <>
      <Header />
      <div className="grid grid-cols-1 lg:grid-cols-4 container mx-auto px-4 pt-6 md:max-w-7xl">
        <div className="lg:col-span-1 space-y-6 p-2 md:py-5 mt-6">
          <ProfileCard
            name={session?.user?.name || ""}
            username={username}
            location="Cameroon"
            memberSince="Sep 2021"
            isNew={true}
            isOnline={true}
            imageUrl={session?.user?.image}
          />

          {/* <LearnmoreCard
            title="Earn badges and stand out"
            description="Boost your sales by boosting your expertise."
            buttonText="Enroll Now"
          /> */}
          <div className="">
            <DescriptionCard
              description="A frontend developer crafts user-friendly interfaces with code magic. He does amazing things to ensure great UI design and goes through lengths to link the front end and the back end"
              languages={[{ language: "English", level: "Basic" }]}
              skills={["Google Voice"]}
            />
          </div>
        </div>
        <div className="lg:col-span-3">
          {totalCount > 0 && (
            <h2 className="font-medium text-gray-500 px-10 sm:px-4">
              {totalCount} {totalCount === 1 ? "listing" : "listings"} found
            </h2>
          )}

          <div>
            {listings.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-4 px-4 sm:px-4">
                  {listings.map((listing, index) => (
                    <ItemCard
                      key={listing.id}
                      listing={listing}
                      slides={generateSlides(listing)}
                      itemCardBg={
                        index < 2
                          ? "bg-[#FFE0B3]"
                          : index === 2
                          ? "bg-[#B3F7FF]"
                          : ""
                      }
                      itemCardImageHieght="h-56 sm:h-40"
                      canEditListing={true}
                      canDeleteListing={true}
                      className="mt-3"
                    />
                  ))}
                </div>
                <div className="mt-10 mb-3 md:mb-0">
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

export const dynamic = "force-dynamic";

export default UserProfilePage;
