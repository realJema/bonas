import React from "react";
import Image from "next/image";

interface Props {
  icon: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategorySelectionItem = ({ icon, label, isSelected, onClick }: Props) => {
  return (
    <div
      className={`flex items-center gap-2 cursor-pointer p-3.5 rounded-md hover:bg-gray-100 transition-colors ${
        isSelected ? "border border-gray-600 bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <Image alt="" src={icon} width={24} height={24} />
      <span className="font-semibold">{label}</span>
    </div>
  );
};

export default CategorySelectionItem;
