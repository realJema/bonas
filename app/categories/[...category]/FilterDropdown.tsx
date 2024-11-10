"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";

interface FilterItem {
  name: string;
  value: string;
}

interface Props {
  label: string;
  items: FilterItem[];
  id: string;
  className?: string;
  selectedValue: string;
}

const FilterDropdown = ({
  label,
  items,
  id,
  className = "",
  selectedValue,
}: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelect = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (value) {
      newSearchParams.set(id, value);
    } else {
      newSearchParams.delete(id);
    }
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const selectedItem =
    items.find((item) => item.value === selectedValue) || items[0];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className={`w-full h-10 justify-between ${className}`}
        >
          {selectedItem.name}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <ScrollArea className="h-[250px] w-full rounded-md">
          <div className="p-4">
            {items.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                className={`w-full justify-start my-1 cursor-pointer hover:bg-accent ${
                  item.value === selectedValue ? "bg-accent" : ""
                }`}
                onClick={() => handleSelect(item.value)}
              >
                {item.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
