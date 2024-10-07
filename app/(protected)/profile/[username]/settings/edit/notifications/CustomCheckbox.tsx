"use client";

import { Checkbox } from "@/components/ui/checkbox";

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

const CustomCheckbox = ({ checked, onCheckedChange, label }: Props) => {
  return (
    <Checkbox
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white border-gray-300"
    />
  );
};

export default CustomCheckbox;