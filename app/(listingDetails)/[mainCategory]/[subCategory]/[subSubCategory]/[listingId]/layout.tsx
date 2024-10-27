import Footer from "@/app/components/sections/Footer/Footer";
import Navbar from "@/app/components/sections/Navbar/Navbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CategriesLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className="mt-12 container mx-auto px-5 md:px-4 md:max-w-7xl">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default CategriesLayout;
