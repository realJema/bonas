import React from "react";
import Link from "next/link";
import Masonry from "react-masonry-css";

interface MenuItem {
  title: string;
  items: string[];
}

const menuItems: MenuItem[] = [
  {
    title: "Website Development",
    items: [
      "Business Websites",
      "E-Commerce Development",
      "Landing Pages",
      "Dropshipping Websites",
      "Build a Complete Website",
    ],
  },
  {
    title: "Website Platforms",
    items: ["WordPress", "Shopify", "Wix", "Custom Websites", "GoDaddy"],
  },
  {
    title: "Website Maintenance",
    items: [
      "Website Customization",
      "Bug Fixes",
      "Backup & Migration",
      "Speed Optimization",
    ],
  },
  {
    title: "AI Development",
    items: [
      "AI Chatbot",
      "AI Applications",
      "AI Integrations",
      "AI Agents",
      "AI Fine-Tuning",
      "Custom GPT Apps",
    ],
  },
  {
    title: "Chatbot Development",
    items: ["Discord", "Telegram", "TikTok", "Facebook Messenger"],
  },
  {
    title: "Game Development",
    items: ["Gameplay Experience & Feedback", "PC Games", "Mobile Games"],
  },
  {
    title: "Mobile App Development",
    items: [
      "Cross-platform Development",
      "Android App Development",
      "IOS App Development",
      "Website to App",
      "Mobile App Maintenance",
      "Wearable App Development",
    ],
  },
  {
    title: "Cloud & Cybersecurity",
    items: ["Cloud Computing", "DevOps Engineering", "Cybersecurity"],
  },
  {
    title: "Data Science & ML",
    items: ["Machine Learning", "Computer Vision", "NLP", "Deep Learning"],
  },
  {
    title: "Software Development",
    items: [
      "Web Applications",
      "Desktop Applications",
      "APIs & Integrations",
      "Databases",
      "Scripting",
      "Browser Extensions",
      "QA & Review",
      "User Testing",
    ],
  },
  {
    title: "Blockchain & Cryptocurrency",
    items: [
      "Decentralized Apps (dApps)",
      "Cryptocurrencies & Tokens",
      "Exchange Platforms",
    ],
  },
  {
    title: "Miscellaneous",
    items: ["Electronics Engineering", "Support & IT", "Convert Files"],
  },
];

const ProgrammingTechDropdown: React.FC = () => {
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

export default ProgrammingTechDropdown;
