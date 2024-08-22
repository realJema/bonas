import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";
import DropdownWrapper from "./DropdownWrapper";
import DropdownMasonry from "./DropdownMansory";
import DropdownLink from "./DropdownLink";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Property Types",
    items: [
      { name: "For Sale", href: "/categories/real-estate/for-sale" },
      { name: "For Rent", href: "/categories/real-estate/for-rent" },
      {
        name: "Holiday Rentals",
        href: "/categories/real-estate/holiday-rentals",
      },
      {
        name: "Shared Accommodations",
        href: "/categories/real-estate/shared-accommodations",
      },
    ],
  },
  {
    title: "Commercial & Land",
    items: [
      {
        name: "Commercial Property",
        href: "/categories/real-estate/commercial-property",
      },
      { name: "Land & Plots", href: "/categories/real-estate/land-plots" },
      {
        name: "Agricultural Land",
        href: "/categories/real-estate/agricultural-land",
      },
      {
        name: "Off-Grid Properties",
        href: "/categories/real-estate/off-grid-properties",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        name: "Real Estate Agents",
        href: "/categories/real-estate/real-estate-agents",
      },
      {
        name: "Property Management",
        href: "/categories/real-estate/property-management",
      },
      {
        name: "Landscaping Services",
        href: "/categories/real-estate/landscaping-services",
      },
      {
        name: "Interior Design",
        href: "/categories/real-estate/interior-design",
      },
    ],
  },
];

const RealEstateDropdown = () => {
  return (
    <DropdownWrapper>
      <DropdownMasonry>
        {menuItems.map((category, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-bold text-gray-900 mb-1">{category.title}</h3>
            {category.items.map((item, itemIndex) => (
              <DropdownLink key={itemIndex} href={item.href}>
                {item.name}
              </DropdownLink>
            ))}
          </div>
        ))}
      </DropdownMasonry>
    </DropdownWrapper>
  );
};

export default RealEstateDropdown;
