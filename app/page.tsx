import { getListings } from "@/utils/getListings";
import { getJobListings } from "@/utils/getJobListings";
import { getRealEstateListings } from "@/utils/getRealEstateListings";
import { getVehiclesAndMotorListings } from "@/utils/getVehiclesAndMotorListings";
import Footer from "./components/sections/Footer/Footer";
import Hero from "./components/sections/Hero/Hero";
import Navbar from "./components/sections/Navbar/Navbar";
import { auth } from "@/auth";
import JobListings from "./components/sections/JobListings/JobListings";
import RealEstates from "./components/sections/RealEstateListings/RealEstateListings";
import VehiculesAndMotor from "./components/sections/VehiclesAndMotorListings/VehiculesAndMotor";
import PremiumContent from "./components/sections/PremiumContent/PremiumContent";

// Server Action
async function fetchListingsForCategory(category: string) {
  "use server";
  const { listings } = await getListings({
    mainCategory: category,
    page: 1,
    pageSize: 10,
  });
  return listings;
}

export default async function Home() {
  const session = await auth();
  const initialListings = await getListings({
    mainCategory: "Electronics",
    page: 1,
    pageSize: 10,
  });

  const jobListings = getJobListings();
  const realEstateListings = getRealEstateListings();
  const vehiclesAndMotorListings = getVehiclesAndMotorListings();

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
        <PremiumContent
          initialListings={initialListings.listings}
          categories={categories}
          onCategoryChange={fetchListingsForCategory}
        />
        <VehiculesAndMotor
          vehiclesAndMotorListings={vehiclesAndMotorListings}
        />
        <JobListings jobListings={jobListings} />
        <RealEstates realEstateListings={realEstateListings} />
        <Footer />
      </div>
    </>
  );
}
