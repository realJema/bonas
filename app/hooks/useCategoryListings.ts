import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ExtendedListing } from "@/app/entities/ExtendedListing";

interface ListingsResponse {
  listings: ExtendedListing[];
  totalCount: number;
}

export const useCategoryListings = (category: string) => {
  return useQuery<ExtendedListing[]>({
    queryKey: ["categoryListings", category],
    queryFn: async () => {
      try {
        const { data } = await axios.get<ListingsResponse>(
          `/api/listings?mainCategory=${encodeURIComponent(
            category
          )}&page=1&pageSize=10`
        );

        // Validate response
        if (!data || !Array.isArray(data.listings)) {
          console.error("Invalid response format:", data);
          return [];
        }

        return data.listings;
      } catch (error) {
        console.error("Error fetching category listings:", error);
        throw error;
      }
    },
    staleTime: 20 * 60,
    retry: 3,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
