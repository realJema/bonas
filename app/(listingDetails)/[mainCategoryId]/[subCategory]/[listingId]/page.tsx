import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import Image from "next/image";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import IconRow from "./IconRow";
import Gig from "./Gig";
import PublishedCard from "./PublishedCard";

const ListingDetailsPage = async ({
  params,
}: {
  params: { mainCategoryId: string; subCategory: string; listingId: string };
}) => {
  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(params.listingId) },
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
        <BreadCrumbs mainCategory={params.subCategory} />
        <IconRow />
      </div>
      <div className="mt-10">
        <Gig
          description={listing.description}
          image={listing.user.profilePicture!}
          location={listing.location!}
          listingImage={listing.images!}
          username={listing.user.name!}
          price={listing.price!}
          datePosted={listing.createdAt}
        />
      </div>
    </div>
  );
};

export default ListingDetailsPage;
