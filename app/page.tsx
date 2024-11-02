import { auth } from "@/auth";
import { fetchListingsForCategory } from "@/utils/fetchListingsForCategory";
import { getJobListings } from "@/utils/getJobListings";
import { getRealEstateListings } from "@/utils/getRealEstateListings";
import { getVehiclesListings } from "@/utils/getVehiclesListings";
import { Suspense } from "react";
import Footer from "./components/sections/Footer/Footer";
import Hero from "./components/sections/Hero/Hero";
import JobListings from "./components/sections/JobListings/JobListings";
import Navbar from "./components/sections/Navbar/Navbar";
import PremiumContentWrapper from "./components/sections/PremiumContentWrapper/PremiumContentWrapper";
import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
import VehiculesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";



export default async function Home() {
  const session = await auth();

  // Fetch all data in parallel using the new cached functions
  const [
    initialListingsResult,
    jobListings,
    realEstateListings,
    vehiclesAndMotorListings,
  ] = await Promise.all([
    fetchListingsForCategory("Electronics"),
    getJobListings(1, 10),
    getRealEstateListings(1, 10),
    getVehiclesListings(),
  ]);

  const categories = [
    {
      label: "Electronics",
      icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/49.svg",
    },
    {
      label: "Real Estate",
      icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/514.svg",
    },
    {
      label: "Jobs",
      icon: "https://fiverr-res.cloudinary.com/listings_assets/gq_icons/67.svg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl px-10 md:px-4">
        <Hero username={session?.user?.name ?? undefined} />
        <PremiumContentWrapper
          initialListings={initialListingsResult}
          categories={categories}
          getListings={fetchListingsForCategory}
        />
        <Suspense fallback={<div>Loading vehicles...</div>}>
          <VehiculesAndMotor vehiclesAndMotorListings={getVehiclesListings()} />
        </Suspense>
        <Suspense fallback={<div>Loading jobs...</div>}>
          <JobListings jobListings={getJobListings()} />
        </Suspense>
        <Suspense fallback={<div>Loading real estate...</div>}>
          <RealEstates realEstateListings={getRealEstateListings()} />
        </Suspense>
        <Footer />
      </div>
    </>
  );
}

// import { getListings } from "@/utils/getListings";
// import { getJobListings } from "@/utils/getJobListings";
// import { getRealEstateListings } from "@/utils/getRealEstateListings";
// import Footer from "./components/sections/Footer/Footer";
// import Hero from "./components/sections/Hero/Hero";
// import Navbar from "./components/sections/Navbar/Navbar";
// import { auth } from "@/auth";
// import JobListings from "./components/sections/JobListings/JobListings";
// import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
// import VehiculesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";
// import PremiumContent from "./components/sections/PremiumContent/PremiumContent";
// import { Suspense } from "react";
// import { getVehiclesListings } from "@/utils/getVehiclesListings";

// // Server Action
// async function fetchListingsForCategory(category: string) {
//   "use server";
//   const { listings } = await getListings({
//     mainCategory: category,
//     page: 1,
//     pageSize: 10,
//   });
//   return listings;
// }

// export default async function Home() {
//   const session = await auth();

//   // Fetch all data in parallel
//   const [
//     { listings: initialListings },
//     jobListings,
//     realEstateListings,
//     vehiclesAndMotorListings,
//   ] = await Promise.all([
//     getListings({
//       mainCategory: "Electronics",
//       page: 1,
//       pageSize: 10,
//     }),
//     getJobListings(),
//     getRealEstateListings(),
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
//         <PremiumContent
//           initialListings={initialListings}
//           categories={categories}
//           onCategoryChange={fetchListingsForCategory}
//         />
//         <Suspense fallback={<div>Loading vehicles...</div>}>
//           <VehiculesAndMotor
//             vehiclesAndMotorListings={Promise.resolve(vehiclesAndMotorListings)}
//           />
//         </Suspense>
//         <Suspense fallback={<div>Loading jobs...</div>}>
//           <JobListings jobListings={Promise.resolve(jobListings)} />
//         </Suspense>
//         <Suspense fallback={<div>Loading real estate...</div>}>
//           <RealEstates
//             realEstateListings={Promise.resolve(realEstateListings)}
//           />
//         </Suspense>
//         <Footer />
//       </div>
//     </>
//   );
// }
