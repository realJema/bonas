import Image from "next/image";
import Hero from "./components/Hero";
import PremiumContent from "./components/PremiumContent";
import VehiculesAndMotor from "./components/VehiculesAndMotor";
import JobListings from "./components/JobListings";
import RealEstates from "./components/RealEstateListings";

export default function Home() {
  return (
    <>
      <Hero />
      <PremiumContent />
      <VehiculesAndMotor />
      <JobListings />
      <RealEstates />
    </>
  );
}
