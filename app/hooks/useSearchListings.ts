import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { SearchResponse , SearchParams } from "../types/search";

export const useSearchListings = ({
  searchTerm,
  mainCategory,
  subCategory,
  subSubCategory,
  enabled = true,
}: SearchParams) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  return useQuery<SearchResponse>({
    queryKey: [
      "listings",
      "search",
      debouncedSearchTerm,
      mainCategory,
      subCategory,
      subSubCategory,
    ],
    queryFn: async () => {
      if (!debouncedSearchTerm) {
        return { listings: [], totalCount: 0, hasMore: false };
      }

      const params = new URLSearchParams({
        searchTerm: debouncedSearchTerm,
        ...(mainCategory && { mainCategory }),
        ...(subCategory && { subCategory }),
        ...(subSubCategory && { subSubCategory }),
      });

      const response = await fetch(`/api/listings/search?${params}`);

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      return response.json();
    },
    enabled: enabled && debouncedSearchTerm.length >= 2,
  });
};
