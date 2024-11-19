// app/page.tsx
import { auth } from "@/auth";
import Footer from "./components/sections/Footer/Footer";
import Hero from "./components/sections/Hero/Hero";
import JobListings from "./components/sections/JobListings/JobListings";
import Navbar from "./components/sections/Navbar/Navbar";
import PremiumContent from "./components/sections/PremiumContent/PremiumContent";
import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
import VehiclesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";

export default async function Home() {
  const session = await auth();

  const categories = [
    {
      label: "Vehicles & Transport",
      icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
    },
    {
      label: "Real Estate",
      icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
    },
    {
      label: "Jobs & Employment",
      icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl px-10 md:px-4">
        <Hero username={session?.user?.name ?? undefined} />
        <PremiumContent categories={categories} />
        <VehiclesAndMotor />
        <JobListings />
        <RealEstates />
        <Footer />
      </div>
    </>
  );
}


// // app/page.tsx
// import { auth } from "@/auth";
// import { Suspense } from "react";
// import Footer from "./components/sections/Footer/Footer";
// import Hero from "./components/sections/Hero/Hero";
// import JobListings from "./components/sections/JobListings/JobListings";
// import Navbar from "./components/sections/Navbar/Navbar";
// import PremiumContent from "./components/sections/PremiumContent/PremiumContent";
// import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
// import prisma from "@/prisma/client";
// import VehiclesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";

// async function getInitialListings() {
//   try {
//     const listings = await prisma.listing.findMany({
//       where: {
//         subcategory_id: {
//           not: null,
//         },
//       },
//       take: 10,
//       orderBy: {
//         created_at: "desc",
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         price: true,
//         subcategory_id: true,
//         currency: true,
//         town: true,
//         address: true,
//         user_id: true,
//         created_at: true,
//         updated_at: true,
//         status: true,
//         views: true,
//         cover_image: true,
//         images: true,
//         is_boosted: true,
//         is_boosted_type: true,
//         is_boosted_expiry_date: true,
//         expiry_date: true,
//         tags: true,
//         condition: true,
//         negotiable: true,
//         delivery_available: true,
//         rating: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//             profilePicture: true,
//           },
//         },
//       },
//     });

//     return listings.map((listing) => ({
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
//       images: listing.images ? JSON.parse(listing.images as string) : null,
//       is_boosted: listing.is_boosted,
//       is_boosted_type: listing.is_boosted_type,
//       is_boosted_expiry_date: listing.is_boosted_expiry_date,
//       expiry_date: listing.expiry_date?.toISOString() || null,
//       tags: listing.tags ? JSON.parse(listing.tags as string) : null,
//       condition: listing.condition,
//       negotiable: listing.negotiable?.toString() || null,
//       delivery_available: listing.delivery_available?.toString() || null,
//       rating: listing.rating,
//   user: listing.user
//     ? {
//         id: listing.user.id,
//         name: listing.user.name,
//         username: listing.user.username,
//         profilePicture: listing.user.profilePicture,
//       }
//     : null,
// }));
//   } catch (error) {
//     console.error("Error fetching initial listings:", error);
//     return [];
//   }
// }

// export default async function Home() {
//   const session = await auth();
//   const initialListings = await getInitialListings();

//   const categories = [
//     {
//       label: "Electronics",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
//     },
//     {
//       label: "Real Estate",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
//     },
//     {
//       label: "Jobs",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto max-w-7xl px-10 md:px-4">
//         <Hero username={session?.user?.name ?? undefined} />
//         <PremiumContent
//           initialListings={initialListings}
//           categories={categories}
//         />
//         <VehiclesAndMotor />
//         <JobListings />
//         <RealEstates />
//         <Footer />
//       </div>
//     </>
//   );
// }

// // app/page.tsx
// import { auth } from "@/auth";
// import { Suspense } from "react";
// import Footer from "./components/sections/Footer/Footer";
// import Hero from "./components/sections/Hero/Hero";
// import JobListings from "./components/sections/JobListings/JobListings";
// import Navbar from "./components/sections/Navbar/Navbar";
// import PremiumContent from "./components/sections/PremiumContent/PremiumContent";
// import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
// import prisma from "@/prisma/client";
// import VehiclesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";

// async function getInitialListings() {
//   try {
//     const listings = await prisma.listing.findMany({
//       where: {
//         subcategory_id: {
//           not: null,
//         },
//       },
//       take: 10,
//       orderBy: {
//         created_at: "desc",
//       },
//       select: {
//         id: true,
//         title: true,
//         description: true,
//         price: true,
//         subcategory_id: true,
//         currency: true,
//         town: true,
//         address: true,
//         user_id: true,
//         created_at: true,
//         updated_at: true,
//         status: true,
//         views: true,
//         cover_image: true,
//         images: true,
//         tags: true,
//         condition: true,
//         negotiable: true,
//         delivery_available: true,
//         rating: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             username: true,
//             image: true,
//             profilePicture: true,
//           },
//         },
//       },
//     });

//     return listings.map((listing) => ({
//       ...listing,
//       id: listing.id.toString(),
//       subcategory_id: listing.subcategory_id?.toString() || null,
//       price: listing.price?.toString() || null,
//       images: listing.images ? JSON.parse(listing.images as string) : null,
//       tags: listing.tags ? JSON.parse(listing.tags as string) : null,
//       negotiable: listing.negotiable?.toString() || null,
//       delivery_available: listing.delivery_available?.toString() || null,
//     }));
//   } catch (error) {
//     console.error("Error fetching initial listings:", error);
//     return [];
//   }
// }

// export default async function Home() {
//   const session = await auth();
//   const initialListings = await getInitialListings();

//   const categories = [
//     {
//       label: "Electronics",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
//     },
//     {
//       label: "Real Estate",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
//     },
//     {
//       label: "Jobs",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto max-w-7xl px-10 md:px-4">
//         <Hero username={session?.user?.name ?? undefined} />
//         <PremiumContent
//           initialListings={initialListings}
//           categories={categories}
//         />
//         <VehiclesAndMotor />
//         <JobListings />
//         <RealEstates />
//         <Footer />
//       </div>
//     </>
//   );
// }

// // app/page.tsx
// import { auth } from "@/auth";
// import { Suspense } from "react";
// import Footer from "./components/sections/Footer/Footer";
// import Hero from "./components/sections/Hero/Hero";
// import JobListings from "./components/sections/JobListings/JobListings";
// import Navbar from "./components/sections/Navbar/Navbar";
// import PremiumContentWrapper from "./components/sections/PremiumContentWrapper/PremiumContentWrapper";
// import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
// import { fetchListingsForCategory } from "@/utils/fetchListingsForCategory";
// import VehiclesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";

// export default async function Home() {
//   const session = await auth();

//   // Fetch initial listings for PremiumContentWrapper
//   const initialListingsResult = await fetchListingsForCategory("Electronics");

//   const categories = [
//     {
//       label: "Electronics",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
//     },
//     {
//       label: "Real Estate",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
//     },
//     {
//       label: "Jobs",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto max-w-7xl px-10 md:px-4">
//         <Hero username={session?.user?.name ?? undefined} />
//         <PremiumContentWrapper
//           initialListings={initialListingsResult}
//           categories={categories}
//           getListings={fetchListingsForCategory}
//         />
//           <VehiclesAndMotor />
//           <JobListings />
//           <RealEstates />
//         <Footer />
//       </div>
//     </>
//   );
// }

// import { auth } from "@/auth";
// import { fetchListingsForCategory } from "@/utils/fetchListingsForCategory";
// import { getJobListings } from "@/utils/getJobListings";
// import { getRealEstateListings } from "@/utils/getRealEstateListings";
// import { getVehiclesListings } from "@/utils/getVehiclesListings";
// import { Suspense } from "react";
// import Footer from "./components/sections/Footer/Footer";
// import Hero from "./components/sections/Hero/Hero";
// import JobListings from "./components/sections/JobListings/JobListings";
// import Navbar from "./components/sections/Navbar/Navbar";
// import PremiumContentWrapper from "./components/sections/PremiumContentWrapper/PremiumContentWrapper";
// import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
// import VehiculesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";

// export default async function Home() {
//   const session = await auth();

//   // Fetch all data in parallel using the new cached functions
//   const [
//     initialListingsResult,
//     jobListings,
//     realEstateListings,
//     vehiclesAndMotorListings,
//   ] = await Promise.all([
//     fetchListingsForCategory("Electronics"),
//     getJobListings(1, 10),
//     getRealEstateListings(1, 10),
//     getVehiclesListings(),
//   ]);

//   const categories = [
//     {
//       label: "Electronics",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
//     },
//     {
//       label: "Real Estate",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
//     },
//     {
//       label: "Jobs",
//       icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
//     },
//   ];

//   return (
//     <>
//       <Navbar />
//       <div className="container mx-auto max-w-7xl px-10 md:px-4">
//         <Hero username={session?.user?.name ?? undefined} />
//         <PremiumContentWrapper
//           initialListings={initialListingsResult}
//           categories={categories}
//           getListings={fetchListingsForCategory}
//         />
//         <Suspense fallback={<div>Loading vehicles...</div>}>
//           <VehiculesAndMotor vehiclesAndMotorListings={getVehiclesListings()} />
//         </Suspense>
//         <Suspense fallback={<div>Loading jobs...</div>}>
//           <JobListings jobListings={getJobListings()} />
//         </Suspense>
//         <Suspense fallback={<div>Loading real estate...</div>}>
//           <RealEstates realEstateListings={getRealEstateListings()} />
//         </Suspense>
//         <Footer />
//       </div>
//     </>
//   );
// }
