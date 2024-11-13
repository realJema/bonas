// app/[mainCategory]/[subCategory]/[subSubCategory]/[listingId]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import IconRow from "./IconRow";
import Gig from "./Gig";

interface ListingParams {
  params: {
    mainCategory: string;
    subCategory: string;
    subSubCategory: string;
    listingId: string;
  };
}

async function getListingDetails(listingId: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: {
        id: BigInt(listingId),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            profilePicture: true,
          },
        },
      },
    });

    if (!listing) {
      return null;
    }

    // Parse JSON fields
    const images = listing.images ? JSON.parse(listing.images as string) : [];
    const tags = listing.tags ? JSON.parse(listing.tags as string) : [];

    return {
      id: listing.id.toString(),
      title: listing.title,
      description: listing.description,
      subcategory_id: listing.subcategory_id?.toString() || null,
      price: listing.price?.toString() || null,
      currency: listing.currency,
      town: listing.town,
      address: listing.address,
      user_id: listing.user_id,
      created_at: listing.created_at?.toISOString() || null,
      updated_at: listing.updated_at?.toISOString() || null,
      status: listing.status,
      views: listing.views,
      cover_image: listing.cover_image,
      images,
      is_boosted: listing.is_boosted,
      is_boosted_type: listing.is_boosted_type,
      is_boosted_expiry_date: listing.is_boosted_expiry_date,
      expiry_date: listing.expiry_date?.toISOString() || null,
      tags,
      condition: listing.condition,
      negotiable: listing.negotiable?.toString() || null,
      delivery_available: listing.delivery_available?.toString() || null,
      rating: listing.rating,
      user: listing.user,
    };
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

const ListingDetailsPage = async ({ params }: ListingParams) => {
  const listing = await getListingDetails(params.listingId);

  if (!listing) {
    notFound();
  }

  return (
    <div className="">
      <div className="md:flex-row items-center justify-between w-full">
        <BreadCrumbs
          subCategory={decodeURIComponent(params.subCategory)}
          mainCategory={decodeURIComponent(params.mainCategory)}
          subSubCategory={decodeURIComponent(params.subSubCategory)}
        />
        <IconRow />
      </div>
      <div className="mt-5">
        <Gig
          title={listing.title || ""}
          description={listing.description || ""}
          image={listing.user?.profilePicture || ""}
          location={listing.town || ""}
          listingImages={listing.images}
          username={listing.user?.name || listing.user?.username || ""}
          price={listing.price}
          datePosted={
            listing.created_at ? new Date(listing.created_at) : new Date()
          }
          categoryName={params.subSubCategory}
          condition={listing.condition}
          currency={listing.currency}
          rating={listing.rating}
          tags={listing.tags}
          userId={listing.user_id}
        />
      </div>
    </div>
  );
};

export default ListingDetailsPage;

// import { notFound } from "next/navigation";
// import prisma from "@/prisma/client";
// import Image from "next/image";
// import BreadCrumbs from "@/app/components/BreadCrumbs";
// import IconRow from "./IconRow";
// import Gig from "./Gig";
// import PublishedCard from "./PublishedCard";

// const ListingDetailsPage = async ({
//   params: { mainCategory, subCategory, subSubCategory, listingId },
// }: {
//   params: {
//     mainCategory: string;
//     subCategory: string;
//     subSubCategory: string;
//     listingId: string;
//   };
// }) => {
//   const listing = await prisma.listing.findUnique({
//     where: { id: parseInt(listingId) },
//     include: {
//       user: true,
//       category: {
//         include: {
//           parent: {
//             include: {
//               parent: true,
//             },
//           },
//         },
//       },
//       images: true,
//     },
//   });

//   if (!listing) {
//     notFound();
//   }

//   return (
//     <div className="">
//       <div className="md:flex-row items-center justify-between w-full">
//         <BreadCrumbs
//           subCategory={decodeURIComponent(subCategory)}
//           mainCategory={decodeURIComponent(mainCategory)}
//           subSubCategory={decodeURIComponent(subSubCategory)}
//         />
//         <IconRow />
//       </div>
//       <div className="mt-5">
//         <Gig
//           title={listing.title}
//           description={listing.description}
//           image={listing.user.profilePicture || ""}
//           location={listing.location || ""}
//           listingImage={listing.images!}
//           username={listing.user.name || ""}
//           price={listing.price?.toString() || listing.budget}
//           datePosted={listing.createdAt}
//           categoryId={listing.category.parentId}
//           category={listing.category.name}
//         />
//       </div>
//     </div>
//   );
// };

// export default ListingDetailsPage;
