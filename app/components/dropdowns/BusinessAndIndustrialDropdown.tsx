import React from "react";
import DropdownWrapper from "./DropdownWrapper";
import DropdownMasonry from "./DropdownMansory";
import DropdownLink from "./DropdownLink";

interface MenuItem {
  title: string;
  items: { name: string; href: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: "Business Assets",
    items: [
      { name: "For Sale", href: "/categories/business-industrial/for-sale" },
      { name: "Equipment", href: "/categories/business-industrial/equipment" },
      { name: "Machinery", href: "/categories/business-industrial/machinery" },
      {
        name: "Raw Materials",
        href: "/categories/business-industrial/raw-materials",
      },
    ],
  },
  {
    title: "Office & Supplies",
    items: [
      {
        name: "Office Supplies",
        href: "/categories/business-industrial/office-supplies",
      },
      {
        name: "Commercial Vehicles",
        href: "/categories/business-industrial/commercial-vehicles",
      },
      {
        name: "Industrial Supplies",
        href: "/categories/business-industrial/industrial-supplies",
      },
      { name: "Wholesale", href: "/categories/business-industrial/wholesale" },
    ],
  },
  {
    title: "Services & Opportunities",
    items: [
      {
        name: "Business Services",
        href: "/categories/business-industrial/business-services",
      },
      {
        name: "Franchise Opportunities",
        href: "/categories/business-industrial/franchise-opportunities",
      },
      {
        name: "Supply Chain Services",
        href: "/categories/business-industrial/supply-chain-services",
      },
      {
        name: "Business Consulting",
        href: "/categories/business-industrial/business-consulting",
      },
    ],
  },
];

const BusinessAndIndustrialDropdown = () => {
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

export default BusinessAndIndustrialDropdown;
