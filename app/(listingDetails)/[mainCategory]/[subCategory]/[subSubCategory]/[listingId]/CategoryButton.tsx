import { Button } from "@/components/ui/button";
import React from "react";

interface Props {
  label: string;
}

const CategoryButton = ({ label }: Props) => {
  return (
    <button className="rounded-full text-gray-700 bg-gray-200 py-2.5 px-3.5 md:text-lg">
      {label}
    </button>
  );
};

export default CategoryButton;
