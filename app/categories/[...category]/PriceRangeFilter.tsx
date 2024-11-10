"use client";

import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "@/app/hooks/useDebounce";
import { formatPrice } from "@/utils/formatUtils";

const MAX_PRICE = 100_000_000; 

const PriceFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize state from URL or defaults
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || MAX_PRICE,
  ]);

  // Debounce price changes to prevent too many URL updates
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Update URL with new price range
  const updateUrl = useCallback(
    (minPrice: number, maxPrice: number) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      // Only add params if they're different from defaults
      if (minPrice > 0) {
        current.set("minPrice", minPrice.toString());
      } else {
        current.delete("minPrice");
      }

      if (maxPrice < MAX_PRICE) {
        current.set("maxPrice", maxPrice.toString());
      } else {
        current.delete("maxPrice");
      }

      // Reset to page 1 when filter changes
      current.set("page", "1");

      const search = current.toString();
      const query = search ? `?${search}` : "";

      router.push(`${pathname}${query}`);
    },
    [pathname, router, searchParams]
  );

  // Update URL when debounced price range changes
  useEffect(() => {
    updateUrl(debouncedPriceRange[0], debouncedPriceRange[1]);
  }, [debouncedPriceRange, updateUrl]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Price Range</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Slider
            min={0}
            max={MAX_PRICE}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="w-full"
          />
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Min:</span>{" "}
              <span className="font-medium">{formatPrice(priceRange[0])}</span>
            </div>
            <div>
              <span className="text-gray-500">Max:</span>{" "}
              <span className="font-medium">{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceFilter;
