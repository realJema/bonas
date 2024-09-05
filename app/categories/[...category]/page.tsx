import FilterDropdown from "./FilterDropdown";
import Search from "./Search";

import Footer from "@/app/components/Footer";
import { getListings } from "@/utils/getListings";
import Hero from "./Hero";
import Listings from "./Listings";
import BreadCrumbs from "./BreadCrumbs";

interface Props {
  params: { category: string[] };
  searchParams: { page: string };
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

const CategoryPage = async ({ params: { category }, searchParams }: Props) => {
  const mainCategory = category[0];
  const subCategory = category[1] || "";

  console.log(`Main category: ${mainCategory}, sub-category: ${subCategory}`);

  const listings = await getListings({
    mainCategory,
    subCategory,
    page: parseInt(searchParams.page) || 1,
    pageSize: 20,
  });

  // console.log("listings: ", listings);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pt-10">
        {/* Mobile filters */}
        <div className="md:hidden flex overflow-x-auto space-x-6 pb-4">
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
          <aside className="hidden md:block md:w-64">
            <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto">
              <div className="flex flex-col space-y-6 pb-6">
                <Search />
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
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-5">
            <BreadCrumbs
              mainCategory={mainCategory}
              subCategory={subCategory}
            />

            {/* listings */}
            <Listings page={searchParams.page} listings={listings} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
