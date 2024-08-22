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
    title: "Pet Types",
    items: [
      { name: "Dogs", href: "/categories/pets/dogs" },
      { name: "Cats", href: "/categories/pets/cats" },
      { name: "Birds", href: "/categories/pets/birds" },
      { name: "Fish", href: "/categories/pets/fish" },
      { name: "Small Animals", href: "/categories/pets/small-animals" },
    ],
  },
  {
    title: "Pet Care",
    items: [
      { name: "Pet Supplies", href: "/categories/pets/pet-supplies" },
      { name: "Pet Services", href: "/categories/pets/pet-services" },
      { name: "Pet Adoption", href: "/categories/pets/pet-adoption" },
      { name: "Pet Training", href: "/categories/pets/pet-training" },
    ],
  },
  {
    title: "Pet Support",
    items: [
      { name: "Pet Boarding", href: "/categories/pets/pet-boarding" },
      {
        name: "Veterinary Services",
        href: "/categories/pets/veterinary-services",
      },
      { name: "Pet Grooming", href: "/categories/pets/pet-grooming" },
      { name: "Pet Insurance", href: "/categories/pets/pet-insurance" },
    ],
  },
];

const PetsDropdown = () => {
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

export default PetsDropdown;
