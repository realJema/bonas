import Footer from "@/app/components/Footer";
import Navbar from "@/app/Navbar";
import React, { PropsWithChildren } from "react";

const UserProfileLayout = ({ children }: PropsWithChildren) => {
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

export default UserProfileLayout;
