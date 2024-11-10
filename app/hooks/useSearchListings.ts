import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";

interface SearchParams {
  searchTerm: string;
  mainCategory?: string;
  subCategory?: string;
  subSubCategory?: string;
}

export const useSearchListings = (params: SearchParams) => {
  const debouncedSearchTerm = useDebounce(params.searchTerm, 300);

  return useQuery({
    queryKey: [
      "listings",
      "search",
      debouncedSearchTerm,
      params.mainCategory,
      params.subCategory,
      params.subSubCategory,
    ],
    queryFn: async () => {
      if (!debouncedSearchTerm) return { listings: [], totalCount: 0 };

      const searchParams = new URLSearchParams({
        searchTerm: debouncedSearchTerm,
        ...(params.mainCategory && { mainCategory: params.mainCategory }),
        ...(params.subCategory && { subCategory: params.subCategory }),
        ...(params.subSubCategory && { subSubCategory: params.subSubCategory }),
      });

      const response = await fetch(`/api/listings/search?${searchParams}`);
      if (!response.ok) throw new Error("Failed to fetch listings");
      return response.json();
    },
    enabled: debouncedSearchTerm.length >= 2,
  });
};
