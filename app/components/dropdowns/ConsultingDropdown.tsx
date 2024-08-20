import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Business Consulting",
    items: [
      {
        name: "Strategy Consulting",
        href: "/categories/consulting/strategy-consulting",
      },
      {
        name: "Management Consulting",
        href: "/categories/consulting/management-consulting",
      },
      {
        name: "Financial Consulting",
        href: "/categories/consulting/financial-consulting",
      },
      {
        name: "Operations Consulting",
        href: "/categories/consulting/operations-consulting",
      },
    ],
  },
  {
    title: "IT Consulting",
    items: [
      {
        name: "Software Development",
        href: "/categories/consulting/software-development",
      },
      {
        name: "Cybersecurity Consulting",
        href: "/categories/consulting/cybersecurity-consulting",
      },
      {
        name: "Cloud Consulting",
        href: "/categories/consulting/cloud-consulting",
      },
      {
        name: "Data Analytics Consulting",
        href: "/categories/consulting/data-analytics-consulting",
      },
    ],
  },
  {
    title: "Specialized Consulting",
    items: [
      { name: "HR Consulting", href: "/categories/consulting/hr-consulting" },
      {
        name: "Marketing Consulting",
        href: "/categories/consulting/marketing-consulting",
      },
      {
        name: "Legal Consulting",
        href: "/categories/consulting/legal-consulting",
      },
      {
        name: "Environmental Consulting",
        href: "/categories/consulting/environmental-consulting",
      },
    ],
  },
];

const ConsultingDropdown = () => {
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

export default ConsultingDropdown;
