import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Household Services",
    items: [
      {
        name: "Cleaning Services",
        href: "/categories/services/cleaning-services",
      },
      {
        name: "Construction & Renovation",
        href: "/categories/services/construction-renovation",
      },
      { name: "Home Repairs", href: "/categories/services/home-repairs" },
      { name: "Gardening", href: "/categories/services/gardening" },
    ],
  },
  {
    title: "Professional Services",
    items: [
      { name: "Event Planning", href: "/categories/services/event-planning" },
      { name: "Tutoring", href: "/categories/services/tutoring" },
      { name: "Beauty Services", href: "/categories/services/beauty-services" },
      { name: "Legal Services", href: "/categories/services/legal-services" },
      {
        name: "Accounting & Tax Services",
        href: "/categories/services/accounting-tax-services",
      },
    ],
  },
  {
    title: "Technical & Travel",
    items: [
      { name: "IT Support", href: "/categories/services/it-support" },
      { name: "Transportation", href: "/categories/services/transportation" },
      { name: "Travel & Tourism", href: "/categories/services/travel-tourism" },
      {
        name: "Health & Wellness",
        href: "/categories/services/health-wellness",
      },
    ],
  },
];

const ServicesDropdown = () => {
  return (
    <div className="absolute left-0 mt-2 w-screen max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden z-30">
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

export default ServicesDropdown;
