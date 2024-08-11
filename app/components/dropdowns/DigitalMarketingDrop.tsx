import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Search",
    items: [
      { name: "Search Engine Optimization (SEO)", href: "/seo" },
      { name: "Search Engine Marketing (SEM)", href: "#" },
      { name: "Local SEO", href: "#" },
      { name: "E-Commerce SEO", href: "#" },
      { name: "Video SEO", href: "#" },
    ],
  },
  {
    title: "Methods & Techniques",
    items: [
      { name: "Video Marketing", href: "#" },
      { name: "E-Commerce Marketing", href: "#" },
      { name: "Email Marketing", href: "#" },
      { name: "Email Automations", href: "#" },
      { name: "Guest Posting", href: "#" },
      { name: "Affiliate Marketing", href: "#" },
      { name: "Display Advertising", href: "#" },
      { name: "Public Relations", href: "#" },
      { name: "Text Message Marketing", href: "#" },
    ],
  },
  {
    title: "Analytics & Strategy",
    items: [
      { name: "Marketing Strategy", href: "#" },
      { name: "Marketing Concepts & Ideation", href: "#" },
      { name: "Marketing Advice", href: "#" },
      { name: "Web Analytics", href: "#" },
      { name: "Conversion Rate Optimization (CRO)", href: "#" },
    ],
  },
  {
    title: "Industry & Purpose-Specific",
    items: [
      { name: "Music Promotion", href: "#" },
      { name: "Podcast Marketing", href: "#" },
      { name: "Book & eBook Marketing", href: "#" },
      { name: "Mobile App Marketing", href: "#" },
    ],
  },
  {
    title: "Social",
    items: [
      { name: "Social Media Marketing", href: "#" },
      { name: "Paid Social Media", href: "#" },
      { name: "Social Commerce", href: "#" },
      { name: "Influencer Marketing", href: "#" },
      { name: "Community Management", href: "#" },
    ],
  },
  {
    title: "Channel Specific",
    items: [
      { name: "TikTok Shop", href: "#" },
      { name: "Facebook Ads Campaign", href: "#" },
      { name: "Instagram Marketing", href: "#" },
      { name: "Google SEM", href: "#" },
      { name: "Shopify Marketing", href: "#" },
    ],
  },
  {
    title: "Miscellaneous",
    items: [
      { name: "Crowdfunding", href: "#" },
      { name: "Other", href: "#" },
    ],
  },
];

const DigitalMarketingDrop = () => {
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

export default DigitalMarketingDrop;
