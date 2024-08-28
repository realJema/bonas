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

export default VehiclesDropdown;
