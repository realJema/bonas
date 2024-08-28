"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import VehiclesDropdown from "./dropdowns/VehiclesDropdown";
import JobsDropdown from "./dropdowns/JobsDropdown";
import ElectronicsDropdown from "./dropdowns/ElectronicsDropdown";
import FashionDropdown from "./dropdowns/FashionDropdown";
import HomeAndGardenDropdown from "./dropdowns/HomeAndGardenDropdown";
import ServicesDropdown from "./dropdowns/ServicesDropdown";
import RealEstateDropdown from "./dropdowns/RealEstate";
import PetsDropdown from "./dropdowns/PetsDropdown";
import HobbiesAndLeisureDropdown from "./dropdowns/HobbiesAndLeisureDropdown";
import BusinessAndIndustrialDropdown from "./dropdowns/BusinessAndIndustrialDropdown";
import ConsultingDropdown from "./dropdowns/ConsultingDropdown";

const Header = () => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const headerItems = [
    { title: "Vehicles", dropdown: <VehiclesDropdown /> },
    { title: "Real Estate", dropdown: <RealEstateDropdown /> },
    { title: "Jobs", dropdown: <JobsDropdown /> },
    { title: "Electronics", dropdown: <ElectronicsDropdown /> },
    { title: "Fashion", dropdown: <FashionDropdown /> },
    { title: "Home & Garden", dropdown: <HomeAndGardenDropdown /> },
    { title: "Services", dropdown: <ServicesDropdown /> },
    { title: "Pets", dropdown: <PetsDropdown /> },
    { title: "Hobbies & Leisure", dropdown: <HobbiesAndLeisureDropdown /> },
    {
      title: "Business & Industrial",
      dropdown: <BusinessAndIndustrialDropdown />,
    },
    { title: "Consulting", dropdown: <ConsultingDropdown /> },
    { title: "AI Services" },
    { title: "Personal Growth" },
  ];

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
      }
    };
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth / 2;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleMouseEnter = (index: number) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300);
  };

  return (
    <header className="hidden md:block border-b xl:px-0 relative">
      <div className="hidden sm:block container mx-auto md:max-w-7xl relative">
        <div className="relative">
          {showLeftArrow && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 z-20"
              >
                <svg
                  width="8"
                  height="15"
                  className="text-gray-700"
                  viewBox="0 0 8 15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.2279 0.690653L7.84662 1.30934C7.99306 1.45578 7.99306 1.69322 7.84662 1.83968L2.19978 7.5L7.84662 13.1603C7.99306 13.3067 7.99306 13.5442 7.84662 13.6907L7.2279 14.3094C7.08147 14.4558 6.84403 14.4558 6.69756 14.3094L0.153374 7.76518C0.00693607 7.61875 0.00693607 7.38131 0.153374 7.23484L6.69756 0.690653C6.84403 0.544184 7.08147 0.544184 7.2279 0.690653Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
            </>
          )}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto whitespace-nowrap scrollbar-hide px-6"
          >
            {headerItems.map((item, index) => (
              <div
                key={index}
                className="group inline-flex mr-6 last:mr-0"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="py-2.5 inline-flex items-center gap-x-2 font-medium text-gray-900 text-opacity-80 hover:text-gray-900 border-b-4 border-transparent hover:border-green-500 transition-colors duration-200">
                  {item.title}
                </button>
                {item.dropdown && activeDropdown === index && (
                  <div
                    className="absolute left-0 top-full z-20 w-full transition-opacity duration-300 ease-in-out"
                    style={{
                      opacity: activeDropdown === index ? 1 : 0,
                      visibility:
                        activeDropdown === index ? "visible" : "hidden",
                    }}
                  >
                    {item.dropdown}
                  </div>
                )}
              </div>
            ))}
          </div>
          {showRightArrow && (
            <>
              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 z-20"
              >
                <svg
                  width="8"
                  height="15"
                  className="text-gray-700"
                  viewBox="0 0 8 15"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.772102 14.3093L0.153379 13.6906C0.00694026 13.5442 0.00694026 13.3067 0.153379 13.1603L5.80022 7.5L0.153379 1.83967C0.00694026 1.69323 0.00694026 1.45577 0.153379 1.30931L0.772102 0.690585C0.918534 0.544151 1.15598 0.544151 1.30242 0.690585L7.84661 7.23482C7.99307 7.38125 7.99307 7.61869 7.84661 7.76516L1.30242 14.3093C1.15598 14.4558 0.918534 14.4558 0.772102 14.3093Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
            </>
          )}
        </div>
      </div>
      <div className="sm:hidden p-4">
        <SearchInput onSearch={(searchText) => console.log(searchText)} />
      </div>
    </header>
  );
};

export default Header;
