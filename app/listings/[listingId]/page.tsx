import { notFound } from "next/navigation";
import prisma from "@/prisma/client";

const ListingsDetailsPage = async ({
  params,
}: {
  params: { listingId: string };
}) => {
  const listing = await prisma.listing.findUnique({
    where: { id: parseInt(params.listingId) },
    include: {
      user: true,
      category: true,
      images: true,
    },
  });

  if (!listing) {
    notFound();
  }

  return (
    <div>
      <h1>Listing Details</h1>
      <pre>{JSON.stringify(listing, null, 2)}</pre>
    </div>
  );
};

export default ListingsDetailsPage;
