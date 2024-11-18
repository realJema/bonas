import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useDebounce } from "./useDebounce";
import { useLocalStorage } from "./useLocalStorage";
import { ExtendedListing } from "../entities/ExtendedListing";
import { useState, useCallback } from "react";

interface SearchResult {
  listings: ExtendedListing[];
  totalCount: number;
  hasMore: boolean;
}

interface UseSearchProps {
  initialSearchTerm?: string;
  mainCategory?: string | null;
  subCategory?: string | null;
  subSubCategory?: string | null;
}

export function useSearch({
  initialSearchTerm = "",
  mainCategory = null,
  subCategory = null,
  subSubCategory = null,
}: UseSearchProps = {}): {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: UseQueryResult<SearchResult>;
  recentSearches: string[];
  addToRecentSearches: (term: string) => void;
  clearRecentSearches: () => void;
} {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [recentSearches, setRecentSearches] = useLocalStorage<string[]>("recent-searches", []);

  const addToRecentSearches = useCallback((term: string) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(t => t !== term);
      return [term, ...filtered].slice(0, 5);
    });
  }, [setRecentSearches]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
  }, [setRecentSearches]);

  const searchResults = useQuery<SearchResult>({
    queryKey: ["search", debouncedSearchTerm, mainCategory, subCategory, subSubCategory],
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

      const response = await fetch(`/api/listings/search?${params}`, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      return response.json();
    },
    enabled: debouncedSearchTerm.length >= 2,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    recentSearches,
    addToRecentSearches,
    clearRecentSearches
  };
}