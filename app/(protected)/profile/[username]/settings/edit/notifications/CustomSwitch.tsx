"use client";

import { Switch } from "@/components/ui/switch";

interface Props {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

const CustomSwitch = ({ checked, onCheckedChange, label }: Props) => {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-200"
    />
  );
};

export default CustomSwitch;
