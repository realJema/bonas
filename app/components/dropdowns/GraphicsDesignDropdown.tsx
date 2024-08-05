import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: string[];
}

const menuItems: MenuItem[] = [
  {
    title: "Logo & Brand Identity",
    items: [
      "Logo Design",
      "Brand Style Guides",
      "Business Cards & Stationery",
      "Fonts & Typography",
      "Logo Maker Tool",
    ],
  },
  {
    title: "Web & App Design",
    items: [
      "Website Design",
      "App Design",
      "UX Design",
      "Landing Page Design",
      "Icon Design",
    ],
  },
  {
    title: "Visual Design",
    items: [
      "Image Editing",
      "Presentation Design",
      "Background Removal",
      "Infographic Design",
      "Vector Tracing",
      "Resume Design",
    ],
  },
  {
    title: "Architecture & Building Design",
    items: [
      "Architecture & Interior Design",
      "Landscape Design",
      "Building Engineering",
    ],
  },
  {
    title: "Art & Illustration",
    items: [
      "Illustration",
      "AI Artists",
      "AI Avatar Design",
      "Children's Book Illustration",
      "Portraits & Caricatures",
      "Cartoons & Comics",
      "Pattern Design",
      "Tattoo Design",
      "Storyboards",
      "NFT Art",
    ],
  },
  {
    title: "Product & Gaming",
    items: [
      "Industrial & Product Design",
      "Character Modeling",
      "Game Art",
      "Graphics for Streamers",
    ],
  },
  {
    title: "Marketing Design",
    items: [
      "Social Media Design",
      "Social Posts & Banners",
      "Email Design",
      "Web Banners",
      "Signage Design",
    ],
  },
  {
    title: "3D Design",
    items: [
      "3D Architecture",
      "3D Industrial Design",
      "3D Fashion & Garment",
      "3D Printing Characters",
      "3D Landscape",
      "3D Game Art",
    ],
  },
  {
    title: "Miscellaneous",
    items: ["Design Advice"],
  },

  {
    title: "Print Design",
    items: [
      "Flyer Design",
      "Brochure Design",
      "Poster Design",
      "Catalog Design",
      "Menu Design",
    ],
  },

  {
    title: "Packaging & Covers",
    items: [
      "Packaging & Label Design",
      "Book Design",
      "Book Covers",
      "Album Cover Design",
    ],
  },
  {
    title: "Fashion & Merchandise",
    items: ["T-Shirts & Merchandise", "Fashion Design", "Jewelry Design"],
  },
];

const GraphicsDesignDropdown = () => {
  return (
    <div className="absolute left-0 mt-2 w-screen max-w-7xl bg-white shadow-lg rounded-lg overflow-hidden z-30">
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
                  href="#"
                  className="block text-gray-700 text-opacity-90 hover:text-gray-900 mb-2.5"
                >
                  {item}
                </Link>
              ))}
            </div>
          ))}
        </Masonry>
      </div>
    </div>
  );
};

export default GraphicsDesignDropdown;
