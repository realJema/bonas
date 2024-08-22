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
    title: "Mobile & Computing",
    items: [
      { name: "Mobile Phones", href: "/categories/electronics/mobile-phones" },
      {
        name: "Laptops & Computers",
        href: "/categories/electronics/laptops-computers",
      },
      { name: "Smart Watches", href: "/categories/electronics/smart-watches" },
      { name: "Wearable Tech", href: "/categories/electronics/wearable-tech" },
    ],
  },
  {
    title: "Home & Entertainment",
    items: [
      {
        name: "Home Appliances",
        href: "/categories/electronics/home-appliances",
      },
      { name: "Televisions", href: "/categories/electronics/televisions" },
      {
        name: "Audio & Headphones",
        href: "/categories/electronics/audio-headphones",
      },
      {
        name: "Gaming Consoles",
        href: "/categories/electronics/gaming-consoles",
      },
    ],
  },
  {
    title: "Energy & Accessories",
    items: [
      {
        name: "Generators & Inverters",
        href: "/categories/electronics/generators-inverters",
      },
      { name: "Solar Panels", href: "/categories/electronics/solar-panels" },
      {
        name: "Camera Accessories",
        href: "/categories/electronics/camera-accessories",
      },
      {
        name: "Audio Accessories",
        href: "/categories/electronics/audio-accessories",
      },
    ],
  },
];

const ElectronicsDropdown = () => {
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

export default ElectronicsDropdown;
