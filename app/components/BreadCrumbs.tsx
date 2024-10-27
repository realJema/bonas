import React from "react";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  mainCategory?: string;
  subCategory?: string;
  subSubCategory?: string;
}

const BreadCrumbs = ({ mainCategory, subCategory, subSubCategory }: Props) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 sm:py-4 md:py-5">
      <ol className="flex flex-wrap items-center text-sm sm:text-base md:text-lg">
        <li className="flex items-center">
          <Link href='/'>
          <Home
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500"
            aria-hidden="true"
          />
          </Link>
          <span className="sr-only">Home</span>
        </li>
        {mainCategory && (
          <li className="flex items-center">
            <CustomSeparator />
            <span className="capitalize">{mainCategory}</span>
          </li>
        )}
        {subCategory && (
          <li className="flex items-center">
            <CustomSeparator />
            <span className="capitalize">{subCategory}</span>
          </li>
        )}
        {subSubCategory && (
          <li className="flex items-center">
            <CustomSeparator />
            <span className="capitalize font-semibold">{subSubCategory}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

const CustomSeparator = () => (
  <ChevronRight
    className="mx-2 h-4 w-4 sm:mx-3 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0"
    aria-hidden="true"
  />
);

export default BreadCrumbs;
