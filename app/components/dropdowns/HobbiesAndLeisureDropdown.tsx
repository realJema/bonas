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
    title: "Sports & Fitness",
    items: [
      {
        name: "Sports Equipment",
        href: "/categories/hobbies-leisure/sports-equipment",
      },
      {
        name: "Fitness Equipment",
        href: "/categories/hobbies-leisure/fitness-equipment",
      },
      {
        name: "Outdoor Activities",
        href: "/categories/hobbies-leisure/outdoor-activities",
      },
      {
        name: "DIY Projects",
        href: "/categories/hobbies-leisure/diy-projects",
      },
    ],
  },
  {
    title: "Creative Arts",
    items: [
      { name: "Books", href: "/categories/hobbies-leisure/books" },
      {
        name: "Musical Instruments",
        href: "/categories/hobbies-leisure/musical-instruments",
      },
      {
        name: "Art Supplies",
        href: "/categories/hobbies-leisure/art-supplies",
      },
      { name: "Photography", href: "/categories/hobbies-leisure/photography" },
    ],
  },
  {
    title: "Entertainment",
    items: [
      {
        name: "Collectibles",
        href: "/categories/hobbies-leisure/collectibles",
      },
      { name: "Gaming", href: "/categories/hobbies-leisure/gaming" },
      {
        name: "Travel & Experiences",
        href: "/categories/hobbies-leisure/travel-experiences",
      },
      { name: "Gardening", href: "/categories/hobbies-leisure/gardening" },
    ],
  },
];

const HobbiesAndLeisureDropdown = () => {
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

export default HobbiesAndLeisureDropdown;
