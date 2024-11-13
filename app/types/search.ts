import { ExtendedListing } from "../entities/ExtendedListing";

export interface SearchFormInputs {
  searchTerm: string;
}

export interface SearchParams {
  searchTerm: string;
  mainCategory?: string;
  subCategory?: string;
  subSubCategory?: string;
  enabled?: boolean;
}

export interface SearchResponse {
  listings: ExtendedListing[];
  totalCount: number;
  hasMore: boolean;
}
