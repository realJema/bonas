import React from "react";
import DropdownWrapper from "./DropdownWrapper";
import DropdownMasonry from "./DropdownMansory";
import DropdownLink from "./DropdownLink";

interface HeaderDropdownProps {
  mainCategory: string;
  categories: Array<{
    title: string;
    href: string;
    items: Array<{ name: string; href: string }>;
  }>;
  onItemClick: (url: string) => void;
}

const HeaderDropdown = ({
  mainCategory,
  categories,
  onItemClick,
}: HeaderDropdownProps) => {
  return (
    <DropdownWrapper>
      <DropdownMasonry>
        {categories.map((subcategory, index) => (
          <div key={index} className="mb-6">
            {/* add a link here to h3 for sub categories*/}
            <h3 className="font-bold text-gray-900 mb-1">
              {subcategory.title} 
            </h3>
            <div>
              {subcategory.items.map((item, itemIndex) => (
                <DropdownLink
                  key={itemIndex}
                  href={`/categories/${encodeURIComponent(
                    mainCategory.toLowerCase()
                  )}/${encodeURIComponent(
                    subcategory.title.toLowerCase()
                  )}/${encodeURIComponent(item.name.toLowerCase())}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onItemClick(
                      `/categories/${encodeURIComponent(
                        mainCategory.toLowerCase()
                      )}/${encodeURIComponent(
                        subcategory.title.toLowerCase()
                      )}/${encodeURIComponent(item.name.toLowerCase())}`
                    );
                  }}
                >
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
