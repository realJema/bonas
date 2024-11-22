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
      label: "Electronics & Gadgets",
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
