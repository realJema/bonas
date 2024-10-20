import Footer from "@/app/components/Footer";
import Navbar from "@/app/Navbar";
import React, { PropsWithChildren } from "react";

const UserProfilePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <main className="container mx-auto px-4 md:px-0 md:max-w-7xl mt-16">
        {children}
      </main>
      <Footer />
    </>
  );
};

export default UserProfilePageLayout;