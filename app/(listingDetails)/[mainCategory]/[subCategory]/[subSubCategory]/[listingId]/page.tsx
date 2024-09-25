import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import Image from "next/image";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import IconRow from "./IconRow";
import Gig from "./Gig";
import PublishedCard from "./PublishedCard";

const ListingDetailsPage = async ({
  params: { mainCategory, subCategory, subSubCategory, listingId },
}: {
  params: {
    mainCategory: string;
    subCategory: string;
    subSubCategory: string;
    listingId: string;
  };
}) => {
  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(listingId) },
    include: {
      user: true,
      category: {
        include: {
          parent: true,
        },
      },
      images: true,
    },
  });

  if (!listing) {
    notFound();
  }

  return (
    <div className="">
      <div className="flex items-center justify-between w-full">
        <BreadCrumbs
          subCategory={decodeURIComponent(subCategory)}
          mainCategory={decodeURIComponent(mainCategory)}
          subSubCategory={decodeURIComponent(subSubCategory)}
        />
        <IconRow />
      </div>
      <div className="mt-10">
        <Gig
          description={listing.description}
          image={listing.user.profilePicture!}
          location={listing.location!}
          listingImage={listing.images!}
          username={listing.user.name!}
          price={listing.price!.toString()}
          datePosted={listing.createdAt}
          category={listing.category.description!}
        />
      </div>

      {/* {JSON.stringify(listing)} */}
    </div>
  );
};

export default ListingDetailsPage;
