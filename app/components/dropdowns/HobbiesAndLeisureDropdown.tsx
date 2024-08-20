import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

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
    <div className="absolute left-0 mt-2 w-screen max-w-6xl bg-white shadow-sm rounded-lg overflow-hidden z-30">
      <div className="p-6">
        <Masonry
          breakpointCols={{
            default: 4,
            1100: 3,
            700: 2,
            500: 1,
          }}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {menuItems.map((category, index) => (
            <div key={index} className="mb-6">
              <h3 className="font-bold text-gray-900 mb-1">{category.title}</h3>
              {category.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className="block text-gray-700 text-opacity-90 hover:text-gray-900 mb-2.5"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default HobbiesAndLeisureDropdown;
