import FilterDropdown from "./FilterDropdown";
import Search from "./Search";
import Footer from "@/app/components/Footer";
import Hero from "./Hero";
import Listings from "./Listings";
import Loading from "./loading";
import { Suspense } from "react";
import BreadCrumbs from "@/app/components/BreadCrumbs";

interface Props {
  params: { category: string[] };
  searchParams: {
    page?: string;
    location?: string;
    datePosted?: string;
    "city-region"?: string;
    "date-posted"?: string;
    [key: string]: string | undefined;
  };
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
      { name: "All Locations", value: "" },
      { name: "Yaounde", value: "Yaounde" },
      { name: "Lampa", value: "Lampa" },
      { name: "Sankoutang", value: "Sankoutang" },
      { name: "Bouaflé", value: "Bouaflé" },
      { name: "Kedungtuban", value: "Kedungtuban" },
      { name: "Kalapadua", value: "Kalapadua" },
      { name: "San Pedro Apartado", value: "San Pedro Apartado" },
      { name: "Kawangohari", value: "Kawangohari" },
      { name: "Kelungkung", value: "Kelungkung" },
      { name: "Guojiaba", value: "Guojiaba" },
      { name: "Buzet", value: "Buzet" },
      { name: "Trà My", value: "Trà My" },
      { name: "Brandfort", value: "Brandfort" },
    ],
  },
  {
    id: "date-posted",
    label: "Date Posted",
    items: [
      { name: "Date Posted", value: "" },
      { name: "Last 24 hours", value: "24h" },
      { name: "Last 7 days", value: "7d" },
      { name: "Last 30 days", value: "30d" },
    ],
  },
];

const CategoryPage = ({ params: { category }, searchParams }: Props) => {
  const [mainCategory, subCategory, subSubCategory] =
    category.map(decodeURIComponent);
  const currentPage = parseInt(searchParams.page || "1");
  const pageSize = 9;

  const location = searchParams["city-region"] || "";
  const datePosted = searchParams["date-posted"] || "";

  const getSelectedValue = (id: string): string => {
    return searchParams[id] || "";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow pt-5">
        {/* Mobile filters */}
        <div className="md:hidden flex overflow-x-auto space-x-6 pb-4">
          {filters.map((filter, index) => (
            <FilterDropdown
              key={filter.id}
              id={filter.id}
              label={filter.label}
              items={filter.items}
              className={`flex-shrink-0 relative z-[${50 - index}] w-72`}
              selectedValue={getSelectedValue(filter.id)}
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
                    selectedValue={searchParams[filter.id] || ""}
                  />
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 px-2 pb-0 pt-0">
            <BreadCrumbs
              mainCategory={mainCategory}
              subCategory={subCategory}
              subSubCategory={subSubCategory}
            />
            
            {/* listings */}
              <Listings
                mainCategory={mainCategory}
                subCategory={subCategory}
                subSubCategory={subSubCategory}
                page={currentPage}
                pageSize={pageSize}
                location={location}
                datePosted={datePosted}
              />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CategoryPage;
