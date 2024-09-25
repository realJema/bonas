import React from "react";
import DropdownWrapper from "./DropdownWrapper";
import DropdownMasonry from "./DropdownMansory";
import DropdownLink from "./DropdownLink";
import { Category } from "@prisma/client";

type CategoryWithChildren = Category & {
  children: (Category & {
    children: Category[];
  })[];
};

interface HeaderDropdownProps {
  mainCategory: CategoryWithChildren;
  onItemClick: (url: string) => void;
}

const HeaderDropdown = ({ mainCategory, onItemClick }: HeaderDropdownProps) => {
  const parseSubSubCategories = (description: string | null): string[] => {
    return description ? description.split(", ") : [];
  };

  return (
    <DropdownWrapper>
      <DropdownMasonry>
        {mainCategory.children.map((subcategory) => (
          <div key={subcategory.id} className="mb-6">
            <h3 className="font-bold text-gray-900 mb-1">
              <DropdownLink
                href={`/categories/${encodeURIComponent(
                  mainCategory.name.toLowerCase()
                )}/${encodeURIComponent(subcategory.name.toLowerCase())}`}
                onClick={(e) => {
                  e.preventDefault();
                  onItemClick(
                    `/categories/${encodeURIComponent(
                      mainCategory.name.toLowerCase()
                    )}/${encodeURIComponent(subcategory.name.toLowerCase())}`
                  );
                }}
              >
                {subcategory.name}
              </DropdownLink>
            </h3>
            <div>
              {parseSubSubCategories(subcategory.description).map(
                (item, index) => (
                  <DropdownLink
                    key={index}
                    href={`/categories/${encodeURIComponent(
                      mainCategory.name.toLowerCase()
                    )}/${encodeURIComponent(
                      subcategory.name.toLowerCase()
                    )}/${encodeURIComponent(item.toLowerCase())}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onItemClick(
                        `/categories/${encodeURIComponent(
                          mainCategory.name.toLowerCase()
                        )}/${encodeURIComponent(
                          subcategory.name.toLowerCase()
                        )}/${encodeURIComponent(item.toLowerCase())}`
                      );
                    }}
                  >
                    {item}
                  </DropdownLink>
                )
              )}
            </div>
          </div>
        ))}
      </DropdownMasonry>
    </DropdownWrapper>
  );
};

export default HeaderDropdown;
