import Footer from "@/app/components/sections/Footer/Footer";
import Navbar from "@/app/components/sections/Navbar/Navbar";
import React, { PropsWithChildren } from "react";

const ProfilePageLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar displayHeader="hidden" />
      <main className="bg-[#f7f7f7] px-0">{children}</main>
      <Footer />
    </>
  );
};

export default ProfilePageLayout;
