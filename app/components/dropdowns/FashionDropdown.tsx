import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";
import DropdownMasonry from "./DropdownMansory";
import DropdownWrapper from "./DropdownWrapper";
import DropdownLink from "./DropdownLink";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Clothing",
    items: [
      { name: "Men's Clothing", href: "/categories/fashion/mens-clothing" },
      { name: "Women's Clothing", href: "/categories/fashion/womens-clothing" },
      {
        name: "Vintage Clothing",
        href: "/categories/fashion/vintage-clothing",
      },
      { name: "Custom Clothing", href: "/categories/fashion/custom-clothing" },
    ],
  },
  {
    title: "Footwear & Accessories",
    items: [
      { name: "Footwear", href: "/categories/fashion/footwear" },
      { name: "Bags & Purses", href: "/categories/fashion/bags-purses" },
      { name: "Jewelry", href: "/categories/fashion/jewelry" },
      { name: "Watches", href: "/categories/fashion/watches" },
    ],
  },
  {
    title: "Specialty Wear",
    items: [
      {
        name: "Traditional Wear",
        href: "/categories/fashion/traditional-wear",
      },
      { name: "Bridal Wear", href: "/categories/fashion/bridal-wear" },
      { name: "Sportswear", href: "/categories/fashion/sportswear" },
      { name: "Uniforms", href: "/categories/fashion/uniforms" },
    ],
  },
];

const FashionDropdown = () => {
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

export default FashionDropdown;
