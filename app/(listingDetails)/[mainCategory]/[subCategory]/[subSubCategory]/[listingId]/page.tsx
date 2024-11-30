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

const ListingDetailsPage = async ({ params }: ListingParams) => {
  try {
    const listing = await prisma.listing.findUnique({
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
    });

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
