import React from "react";
import BreadCrumbs from "./BreadCrumbs";
import FilterDropdown from "./FilterDropdown";

interface Props {
  params: { mainCategory: string; subCategory: string };
}

interface FilterItem {
  name: string;
  value: string;
}

interface Filter {
  id: string;
  label: string;
  items: FilterItem[];
}

const filters: Filter[] = [
  {
    id: "city-region",
    label: "City/Region",
    items: [
      { name: "New York", value: "new-york" },
      { name: "Los Angeles", value: "los-angeles" },
      { name: "Chicago", value: "chicago" },
    ],
  },
  {
    id: "date-posted",
    label: "Date Posted",
    items: [
      { name: "Last 24 hours", value: "24h" },
      { name: "Last 7 days", value: "7d" },
      { name: "Last 30 days", value: "30d" },
    ],
  },
  {
    id: "condition",
    label: "Condition",
    items: [
      { name: "New", value: "new" },
      { name: "Used - Like New", value: "like-new" },
      { name: "Used - Good", value: "good" },
      { name: "Used - Fair", value: "fair" },
    ],
  },
];

const CategoryPage = ({ params: { mainCategory, subCategory } }: Props) => {
  return (
    <div className="container mx-auto px-4">
      <BreadCrumbs title={mainCategory} />
      <h3 className="font-extrabold text-2xl capitalize mt-10 mb-6">
        {subCategory}
      </h3>

      {/* Mobile filters */}
      <div className="md:hidden flex overflow-x-auto space-x-4 pb-4">
        {filters.map((filter, index) => (
          <FilterDropdown
            key={filter.id}
            id={filter.id}
            label={filter.label}
            items={filter.items}
            className={`flex-shrink-0 relative z-[${50 - index}]`}
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden md:block md:w-80 sticky top-24 self-start h-screen">
          <div className="flex flex-col space-y-6">
            {filters.map((filter, index) => (
              <FilterDropdown
                key={filter.id}
                id={filter.id}
                label={filter.label}
                items={filter.items}
                className={`w-full relative z-[${50 - index}]`}
              />
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <p>Main content area</p>
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;
