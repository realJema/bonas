import Image from "next/image";
import Hero from "./components/Hero";
import PremiumContent from "./components/PremiumContent";
import VehiculesAndMotor from "./components/VehiculesAndMotor";
import JobListings from "./components/JobListings";

export default function Home() {
  return (
    <>
      <Hero />
      <PremiumContent />
      <VehiculesAndMotor />
      <JobListings />
    </>
  );
}
