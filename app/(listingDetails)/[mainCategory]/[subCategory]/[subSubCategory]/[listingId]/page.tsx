// app/[mainCategory]/[subCategory]/[subSubCategory]/[listingId]/page.tsx
import { notFound } from "next/navigation";
import prisma from "@/prisma/client";
import BreadCrumbs from "@/app/components/BreadCrumbs";
import IconRow from "./IconRow";
import Gig from "./Gig";
import { Review } from "@/app/types/review";

interface ListingParams {
  params: {
    mainCategory: string;
    subCategory: string;
    subSubCategory: string;
    listingId: string;
  };
}

const ListingDetailsPage = async ({ params }: ListingParams) => {
  try {
    // Fetch listing and reviews in parallel
    const [listing, reviewsData, totalReviews] = await Promise.all([
      // Listing query stays same
      prisma.listing.findUnique({
        where: {
          id: BigInt(params.listingId),
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              profilePicture: true,
              profilImage: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      }),

      // Reviews query - matching schema exactly
      prisma.review.findMany({
        where: {
          listingId: BigInt(params.listingId),
          parentId: null, // Get top-level reviews
        },
        include: {
          user: {
            select: {
              name: true,
              image: true,
              profilImage: true, // Include this as fallback
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),

      // Total count stays same
      prisma.review.count({
        where: {
          listingId: BigInt(params.listingId),
          parentId: null,
        },
      }),
    ]);

    // Get replies in separate query
    const parentIds = reviewsData.map((review) => review.id);
    const repliesData = await prisma.review.findMany({
      where: {
        parentId: { in: parentIds },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            profilImage: true,
          },
        },
      },
    });

   const initialReviews: Review[] = reviewsData.map((review) => ({
     id: review.id,
     listingId: review.listingId,
     userId: review.userId,
     rating: review.rating,
     comment: review.comment || "",
     createdAt: review.createdAt,
     parentId: review.parentId || undefined,
     user: {
       name: review.user.name || "",
       image: review.user.image || review.user.profilImage || "",
     },
     _count: {
       replies: repliesData.filter((r) => r.parentId === review.id).length,
     },
     // Only add replies array if there are actual replies
     ...(repliesData.some((r) => r.parentId === review.id) && {
       replies: repliesData
         .filter((r) => r.parentId === review.id)
         .map((reply) => ({
           id: reply.id,
           listingId: reply.listingId,
           userId: reply.userId,
           rating: reply.rating,
           comment: reply.comment || "",
           createdAt: reply.createdAt,
           parentId: reply.parentId || undefined,
           user: {
             name: reply.user.name || "",
             image: reply.user.image || reply.user.profilImage || "",
           },
           _count: { replies: 0 },
         })),
     }),
   }));

    if (!listing || !listing.user) {
      notFound();
    }

    const images =
      typeof listing.images === "string"
        ? JSON.parse(listing.images)
        : Array.isArray(listing.images)
        ? listing.images
        : [];

    const tags =
      typeof listing.tags === "string"
        ? JSON.parse(listing.tags)
        : Array.isArray(listing.tags)
        ? listing.tags
        : [];

    const formattedListing = {
      ...listing,
      id: listing.id.toString(),
      subcategory_id: listing.subcategory_id?.toString(),
      price: listing.price?.toString(),
      negotiable: listing.negotiable?.toString(),
      delivery_available: listing.delivery_available?.toString(),
      images,
      tags,
      user: {
        id: listing.user.id,
        name: listing.user.name,
        username: listing.user.username,
        email: listing.user.email,
        phoneNumber: listing.user.phoneNumber,
        profilePicture: listing.user.profilImage || listing.user.profilePicture,
      },
    };

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
            title={formattedListing.title || ""}
            description={formattedListing.description || ""}
            image={formattedListing.user.profilePicture || ""}
            location={formattedListing.town || ""}
            listingImages={formattedListing.images}
            listingId={formattedListing.id}
            coverImage={listing.cover_image || ""}
            username={
              formattedListing.user.name || formattedListing.user.username || ""
            }
            userEmail={formattedListing.user.email}
            userPhoneNumber={formattedListing.user.phoneNumber}
            price={formattedListing.price ?? ""}
            datePosted={formattedListing.created_at || new Date()}
            categoryName={params.subSubCategory}
            condition={formattedListing.condition}
            currency={formattedListing.currency}
            rating={formattedListing.rating}
            tags={formattedListing.tags}
            userId={formattedListing.user_id}
            negotiable={formattedListing.negotiable || ""}
            deadline={formattedListing.deadline}
            deliveryAvailable={formattedListing.delivery_available || ""}
            initialReviews={initialReviews}
            totalReviews={totalReviews}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching listing:", error);
    notFound();
  }
};

export default ListingDetailsPage;

// // app/[mainCategory]/[subCategory]/[subSubCategory]/[listingId]/page.tsx
// import { notFound } from "next/navigation";
// import prisma from "@/prisma/client";
// import BreadCrumbs from "@/app/components/BreadCrumbs";
// import IconRow from "./IconRow";
// import Gig from "./Gig";

// interface ListingParams {
//   params: {
//     mainCategory: string;
//     subCategory: string;
//     subSubCategory: string;
//     listingId: string;
//   };
// }

// const ListingDetailsPage = async ({ params }: ListingParams) => {
//   try {
//     const listing = await prisma.listing.findUnique({
//       where: {
//         id: BigInt(params.listingId),
//       },
//       include: {
//         user: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             profilePicture: true,
//             profilImage: true,
//             email: true,
//             phoneNumber: true,
//           },
//         },
//       },
//     });

//     if (!listing) {
//       notFound();
//     }

//     // Handle images and tags with type checking
//     const images =
//       typeof listing.images === "string"
//         ? JSON.parse(listing.images)
//         : Array.isArray(listing.images)
//         ? listing.images
//         : [];

//     const tags =
//       typeof listing.tags === "string"
//         ? JSON.parse(listing.tags)
//         : Array.isArray(listing.tags)
//         ? listing.tags
//         : [];

//     const formattedListing = {
//       id: listing.id.toString(),
//       title: listing.title,
//       description: listing.description,
//       subcategory_id: listing.subcategory_id?.toString() || null,
//       price: listing.price?.toString() || null,
//       currency: listing.currency,
//       town: listing.town,
//       address: listing.address,
//       user_id: listing.user_id,
//       created_at: listing.created_at?.toISOString() || null,
//       updated_at: listing.updated_at?.toISOString() || null,
//       status: listing.status,
//       views: listing.views,
//       cover_image: listing.cover_image,
//       images,
//       is_boosted: listing.is_boosted,
//       is_boosted_type: listing.is_boosted_type,
//       is_boosted_expiry_date: listing.is_boosted_expiry_date,
//       expiry_date: listing.expiry_date?.toISOString() || null,
//       tags,
//       condition: listing.condition,
//       negotiable: listing.negotiable?.toString() || null,
//       deadline: listing.deadline || null,
//       delivery_available: listing.delivery_available?.toString() || null,
//       rating: listing.rating,
//       user: {
//         ...listing.user,
//         profilePicture:
//           listing.user?.profilImage || listing.user?.profilePicture,
//       },
//     };

//     return (
//       <div className="">
//         <div className="md:flex-row items-center justify-between w-full">
//           <BreadCrumbs
//             subCategory={decodeURIComponent(params.subCategory)}
//             mainCategory={decodeURIComponent(params.mainCategory)}
//             subSubCategory={decodeURIComponent(params.subSubCategory)}
//           />
//           <IconRow />
//         </div>
//         <div className="mt-5">
//           <Gig
//             title={formattedListing.title || ""}
//             description={formattedListing.description || ""}
//             image={formattedListing.user?.profilePicture || ""}
//             location={formattedListing.town || ""}
//             listingImages={formattedListing.images}
//             coverImage={listing.cover_image || ""}
//             username={
//               formattedListing.user?.name ||
//               formattedListing.user?.username ||
//               ""
//             }
//             userEmail={formattedListing.user.email || ""}
//             userPhoneNumber={formattedListing.user.phoneNumber || ""}
//             price={formattedListing.price}
//             datePosted={
//               formattedListing.created_at
//                 ? new Date(formattedListing.created_at)
//                 : new Date()
//             }
//             categoryName={params.subSubCategory}
//             condition={formattedListing.condition}
//             currency={formattedListing.currency}
//             rating={formattedListing.rating}
//             tags={formattedListing.tags}
//             userId={formattedListing.user_id}
//             negotiable={formattedListing.negotiable || ""}
//             deadline={formattedListing.deadline}
//             deliveryAvailable={formattedListing.delivery_available || ""}
//           />
//         </div>
//       </div>
//     );
//   } catch (error) {
//     console.error("Error fetching listing:", error);
//     notFound();
//   }
// };

// export default ListingDetailsPage;
