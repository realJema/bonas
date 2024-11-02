"use client";

import { ExtendedListing } from "@/app/entities/ExtendedListing";
import PremiumContent from "../PremiumContent/PremiumContent";

interface Category {
  label: string;
  icon: string;
}

interface Props {
  initialListings: ExtendedListing[];
  categories: Category[];
  getListings: (category: string) => Promise<ExtendedListing[]>;
}

export default function PremiumContentWrapper({
  initialListings,
  categories,
  getListings,
}: Props) {
  const handleCategoryChange = async (category: string) => {
    return await getListings(category);
  };

  return (
    <PremiumContent
      initialListings={initialListings}
      categories={categories}
      onCategoryChange={handleCategoryChange}
    />
  );
}
