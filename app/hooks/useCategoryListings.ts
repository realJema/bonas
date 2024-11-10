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
      const { data } = await axios.get<ListingsResponse>(
        `/api/listings?mainCategory=${encodeURIComponent(
          category
        )}&page=1&pageSize=10`
      );
      return data.listings;
    },
    staleTime: 300000,
    retry: 3,
    refetchOnWindowFocus: false,
  });
};
