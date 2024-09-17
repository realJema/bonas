import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import Image from "next/image";

const ListingDetailsPage = async ({
  params,
}: {
  params: { mainCategory: string; subCategory: string; listingId: string };
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Listing Details</h1>
    </div>
  );
};

export default ListingDetailsPage;
