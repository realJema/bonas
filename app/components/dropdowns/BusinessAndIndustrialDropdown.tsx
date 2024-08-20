import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Business Assets",
    items: [
      { name: "For Sale", href: "/categories/business-industrial/for-sale" },
      { name: "Equipment", href: "/categories/business-industrial/equipment" },
      { name: "Machinery", href: "/categories/business-industrial/machinery" },
      {
        name: "Raw Materials",
        href: "/categories/business-industrial/raw-materials",
      },
    ],
  },
  {
    title: "Office & Supplies",
    items: [
      {
        name: "Office Supplies",
        href: "/categories/business-industrial/office-supplies",
      },
      {
        name: "Commercial Vehicles",
        href: "/categories/business-industrial/commercial-vehicles",
      },
      {
        name: "Industrial Supplies",
        href: "/categories/business-industrial/industrial-supplies",
      },
      { name: "Wholesale", href: "/categories/business-industrial/wholesale" },
    ],
  },
  {
    title: "Services & Opportunities",
    items: [
      {
        name: "Business Services",
        href: "/categories/business-industrial/business-services",
      },
      {
        name: "Franchise Opportunities",
        href: "/categories/business-industrial/franchise-opportunities",
      },
      {
        name: "Supply Chain Services",
        href: "/categories/business-industrial/supply-chain-services",
      },
      {
        name: "Business Consulting",
        href: "/categories/business-industrial/business-consulting",
      },
    ],
  },
];

const BusinessAndIndustrialDropdown = () => {
  return (
    <div className="absolute left-0 mt-2 w-screen max-w-6xl bg-white shadow-lg rounded-lg overflow-hidden z-30">
      <div className="p-6">
        <Masonry
          breakpointCols={{
            default: 3,
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

export default BusinessAndIndustrialDropdown;
