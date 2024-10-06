import Footer from "@/app/components/Footer";
import Navbar from "@/app/Navbar";
import React, { PropsWithChildren } from "react";

const ProfilePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar displayHeader="hidden" />
      <main>
        {children}
      </main>
      <Footer />
    </>
  );
};

export default ProfilePageLayout;
