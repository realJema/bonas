import { Button } from "@/components/ui/button";

interface Props {
  label: string;
}

const SkillButton = ({label}:Props) => {
  return <Button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-full text-base transition-colors hover:opacity-70">{label}</Button>;
};

export default SkillButton;
