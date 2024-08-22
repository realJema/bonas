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
    title: "Business Consulting",
    items: [
      {
        name: "Strategy Consulting",
        href: "/categories/consulting/strategy-consulting",
      },
      {
        name: "Management Consulting",
        href: "/categories/consulting/management-consulting",
      },
      {
        name: "Financial Consulting",
        href: "/categories/consulting/financial-consulting",
      },
      {
        name: "Operations Consulting",
        href: "/categories/consulting/operations-consulting",
      },
    ],
  },
  {
    title: "IT Consulting",
    items: [
      {
        name: "Software Development",
        href: "/categories/consulting/software-development",
      },
      {
        name: "Cybersecurity Consulting",
        href: "/categories/consulting/cybersecurity-consulting",
      },
      {
        name: "Cloud Consulting",
        href: "/categories/consulting/cloud-consulting",
      },
      {
        name: "Data Analytics Consulting",
        href: "/categories/consulting/data-analytics-consulting",
      },
    ],
  },
  {
    title: "Specialized Consulting",
    items: [
      { name: "HR Consulting", href: "/categories/consulting/hr-consulting" },
      {
        name: "Marketing Consulting",
        href: "/categories/consulting/marketing-consulting",
      },
      {
        name: "Legal Consulting",
        href: "/categories/consulting/legal-consulting",
      },
      {
        name: "Environmental Consulting",
        href: "/categories/consulting/environmental-consulting",
      },
    ],
  },
];

const ConsultingDropdown = () => {
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

export default ConsultingDropdown;
