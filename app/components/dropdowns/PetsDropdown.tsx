import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

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

export default PetsDropdown;
