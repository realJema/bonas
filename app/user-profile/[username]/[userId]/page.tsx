import { getListingsByUserId } from "@/utils/getListingsByUserId";
import UserProfile from "./UserProfile";
import ProfileCard from "./ProfileCard";
import Pagination from "@/app/components/Pagination";
import ItemCard from "@/app/components/cards/ItemCard/ItemCard";
import { generateSlides } from "@/utils/generateSlides";
import Reviews from "@/app/components/Reviews";
import SearchReviews from "@/app/components/SearchReviews";
import ReviewCard, {
  ReviewCardItems,
} from "@/app/components/cards/ReviewCard/ReviewCard";
import SortReview from "./SortReview";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";

interface Props {
  params: {
    username: string;
    userId: string;
  };
  searchParams: { page?: string };
}

const sampleReviews: ReviewCardItems[] = [
  {
    name: "John Doe",
    location: "New York, USA",
    createdAt: new Date("2023-06-15"),
    rating: 5,
    comment:
      "Excellent service! The gig was completed quickly and the quality exceeded my expectations. I highly recommend this seller.",
  },
  {
    name: "Jane Smith",
    location: "London, UK",
    createdAt: new Date("2023-07-02"),
    rating: 4,
    comment:
      "Very good work overall. There were a few minor issues, but the seller was quick to address them. I would use their services again.",
  },
  {
    name: "Alex Johnson",
    location: "Sydney, Australia",
    createdAt: new Date("2023-07-20"),
    rating: 5,
  },
];

const PublicUserProfile = async ({
  params: { username, userId },
  searchParams,
}: Props) => {
  const pageSize = 8;
  const currentPage = parseInt(searchParams.page || "1");

   const user = await prisma.user.findUnique({
     where: { id: userId },
     select: {
       id: true,
       name: true,
       username: true,
       profilImage: true,
     },
   });

   if (!user) {
     notFound();
   }

  // Fetch user's listings using existing function
  const { listings, totalCount } = await getListingsByUserId({
    userId: user.id,
    page: currentPage,
    pageSize,
  });

  const skills = [
    "Digital marketer",
    "SEO expert",
    "Social media marketer",
    "Content writer",
  ];

  const bio =
    "Writer on Medium & Vocal. Know a bit about Search Engine Optimization, getting over 100,000 views in the last 30 days. Writing online is powerful and I could help you write better. My articles are search optimized so I would help you to get more organic traffic for a lifetime.";

  return (
    <div className="pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <UserProfile
            username={user.username || user.id}
            name={user.name || ""}
            image={user.profilImage || ""}
            skills={skills}
            bio={bio}
            location="Pakistan"
          />
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <ProfileCard
              name={user.name || user.username || user.id}
              offlineTime="03:16 PM local time"
              averageResponseTime="6 hours"
              image={user.profilImage || ""}
            />
          </div>
        </div>
      </div>

      <div className="">
        {listings.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 py-4 px-4 sm:px-4">
              {listings.map((listing) => (
                <ItemCard
                  key={listing.id}
                  listing={listing}
                  slides={generateSlides(listing)}
                  itemCardImageHieght="h-56 sm:h-40"
                  canEditListing={false}
                  canDeleteListing={false}
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

      <div className="flex-col space-y-4 mt-6 w-full max-w-3xl mx-auto sm:mx-0 px-3 sm:px-0">
        <Reviews />
        <div className="w-full sm:max-w-2xl">
          <SearchReviews />
          <SortReview className="my-6" />
          <div className="space-y-4">
            {sampleReviews.map((review, index) => (
              <ReviewCard key={index} {...review} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicUserProfile;
