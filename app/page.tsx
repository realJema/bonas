import Image from "next/image";
import Hero from "./components/Hero";
import PremiumContent from "./components/PremiumContent";
import VehiculesAndMotor from "./components/VehiculesAndMotor";
import JobListings from "./components/JobListings";
import RealEstates from "./components/RealEstateListings";
import Footer from "./components/Footer";
import Navbar from "./Navbar";
import prisma from "@/prisma/client";
import { fetchAllJobListings } from "@/utils/getJobListings";
import { getRealEstateListings } from "@/utils/getRealEstateListings";
import { getVehiclesAndMotorListings } from "@/utils/getVehiclesAndMotorListings";

export default async function Home() {
  const jobListings = await fetchAllJobListings();
  const realEstateListings = await getRealEstateListings();
  const vehiclesAndMotorListings = await getVehiclesAndMotorListings();

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl px-10 md:px-4">
        <Hero />
        <PremiumContent />
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
