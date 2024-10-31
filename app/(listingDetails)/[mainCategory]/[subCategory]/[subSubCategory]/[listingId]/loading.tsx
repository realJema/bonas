import Footer from "@/app/components/sections/Footer/Footer";
import Navbar from "@/app/components/sections/Navbar/Navbar";
import BreadCrumbsSkeleton from "@/app/components/skeletons/BreadCrumbSkeleton";
import FooterSkeleton from "@/app/components/skeletons/FooterSkeleton";
import GigSkeleton from "@/app/components/skeletons/GigSkeleton";
import HeaderSkeleton from "@/app/components/skeletons/HeaderSkeleton";
import IconRowSkeleton from "@/app/components/skeletons/IconRowSkeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className="container mx-auto mt-10 px-10 md:px-4 md:max-w-7xl">
        <div className="md:flex-row items-center justify-between w-full">
          <BreadCrumbsSkeleton />
          <IconRowSkeleton />
        </div>
        <div className="">
          <GigSkeleton />
        </div>
      </div>
      <FooterSkeleton />
    </>
  );
};

export default Loading;
