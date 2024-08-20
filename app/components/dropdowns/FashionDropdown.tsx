import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

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

export default FashionDropdown;
