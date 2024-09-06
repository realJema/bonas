import React from "react";
import DropdownWrapper from "./DropdownWrapper";
import DropdownMasonry from "./DropdownMansory";
import DropdownLink from "./DropdownLink";
import Link from "next/link";

interface HeaderDropdownProps {
  mainCategory: string;
  categories: Array<{
    title: string;
    items: Array<{
      name: string;
      href: string;
    }>;
  }>;
  generateUrl: (category: string, subcategory?: string) => string;
}

const HeaderDropdown = ({ mainCategory, categories, generateUrl }: HeaderDropdownProps) => {
  return (
    <DropdownWrapper>
      <DropdownMasonry>
        {categories.map((subcategory, index) => (
          <div key={index} className="mb-6">
            <h3 className="font-bold text-gray-900 mb-1">
                {subcategory.title}
            </h3>
            <div>
              {subcategory.items.map((item, itemIndex) => (
                <DropdownLink key={itemIndex} href={generateUrl(mainCategory, item.name)}>
                  {item.name}
                </DropdownLink>
              ))}
            </div>
          </div>
        ))}
      </DropdownMasonry>
    </DropdownWrapper>
  );
};

export default HeaderDropdown;