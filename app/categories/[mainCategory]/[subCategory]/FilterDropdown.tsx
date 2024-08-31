"use client";

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
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
}

const FilterDropdown = ({ label, items, id, className = "" }: Props) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={false}
          className={`w-full justify-between ${className}`}
        >
          {label}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <div className="space-y-2">
          {items.map((item, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {
                console.log(
                  `Selected ${item.name} (${item.value}) for ${label}`
                );
              }}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default FilterDropdown;
