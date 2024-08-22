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
    title: "Furniture & Decor",
    items: [
      { name: "Furniture", href: "/categories/home-garden/furniture" },
      { name: "Home Decor", href: "/categories/home-garden/home-decor" },
      {
        name: "Bedding & Linens",
        href: "/categories/home-garden/bedding-linens",
      },
      {
        name: "Outdoor Furniture",
        href: "/categories/home-garden/outdoor-furniture",
      },
    ],
  },
  {
    title: "Appliances & Tools",
    items: [
      {
        name: "Kitchen Appliances",
        href: "/categories/home-garden/kitchen-appliances",
      },
      { name: "Garden Tools", href: "/categories/home-garden/garden-tools" },
      { name: "DIY Materials", href: "/categories/home-garden/diy-materials" },
      {
        name: "Home Improvement",
        href: "/categories/home-garden/home-improvement",
      },
    ],
  },
  {
    title: "Services",
    items: [
      {
        name: "Appliance Repair",
        href: "/categories/home-garden/appliance-repair",
      },
      {
        name: "Landscaping Services",
        href: "/categories/home-garden/landscaping-services",
      },
      {
        name: "Interior Design",
        href: "/categories/home-garden/interior-design",
      },
      { name: "Home Repairs", href: "/categories/home-garden/home-repairs" },
    ],
  },
];

const HomeAndGardenDropdown = () => {
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

export default HomeAndGardenDropdown;
