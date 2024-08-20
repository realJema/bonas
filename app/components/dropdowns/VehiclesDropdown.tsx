import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Cars & Motorbikes",
    items: [
      { name: "Cars", href: "/categories/vehicles/cars" },
      { name: "Motorbikes", href: "/categories/vehicles/motorbikes" },
      { name: "Bicycles", href: "/categories/vehicles/bicycles" },
      { name: "Scooters", href: "/categories/vehicles/scooters" },
    ],
  },
  {
    title: "Commercial Vehicles",
    items: [
      { name: "Trucks", href: "/categories/vehicles/trucks" },
      { name: "Vans", href: "/categories/vehicles/vans" },
      { name: "Heavy Machinery", href: "/categories/vehicles/heavy-machinery" },
      {
        name: "Commercial Vehicles",
        href: "/categories/vehicles/commercial-vehicles",
      },
    ],
  },
  {
    title: "Auto Services & Parts",
    items: [
      {
        name: "Auto Parts & Accessories",
        href: "/categories/vehicles/auto-parts-accessories",
      },
      { name: "Car Rentals", href: "/categories/vehicles/car-rentals" },
      { name: "Car Services", href: "/categories/vehicles/car-services" },
      { name: "Boat & Marine", href: "/categories/vehicles/boat-marine" },
    ],
  },
];

const VehiclesDropdown = () => {
  return (
    <div className="absolute left-0 mt-2 w-screen max-w-6xl bg-[#fff] shadow-lg rounded-lg overflow-hidden z-30 border-r-2 border-solid border-b border-gray-50">
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

export default VehiclesDropdown;
