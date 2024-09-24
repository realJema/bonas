import Footer from "@/app/components/Footer";
import Navbar from "@/app/Navbar";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const CategriesLayout = ({ children }: Props) => {
  return (
    <>
      <Navbar />
      <main className="mt-12 container mx-auto px-10 md:px-4 md:max-w-7xl">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default CategriesLayout;
