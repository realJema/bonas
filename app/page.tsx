import Image from "next/image";
import Hero from "./components/Hero";
import PremiumContent from "./components/PremiumContent";
import VehiculesAndMotor from "./components/VehiculesAndMotor";
import JobListings from "./components/JobListings";
import RealEstates from "./components/RealEstateListings";
import Footer from "./components/Footer";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl px-10 md:px-4">
        <Hero />
        <PremiumContent />
        <VehiculesAndMotor />
        <JobListings />
        <RealEstates />
        <Footer />
      </div>
    </>
  );
}
