import {getListings} from "@/utils/getListings"
import { getJobListings } from "@/utils/getJobListings";
import { getRealEstateListings } from "@/utils/getRealEstateListings";
import { getVehiclesAndMotorListings } from "@/utils/getVehiclesAndMotorListings";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import JobListings from "./components/JobListings";
import PremiumContent from "./components/PremiumContent";
import RealEstates from "./components/RealEstateListings";
import VehiculesAndMotor from "./components/VehiculesAndMotor";
import Navbar from "./Navbar";
import { auth } from "@/auth";

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
