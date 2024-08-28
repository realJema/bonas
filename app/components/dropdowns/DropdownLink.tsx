import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  href: string;
  children: ReactNode;
}

const DropdownLink = ({ href, children }: Props) => {
  return (
    <Link
      href={href}
      className="block text-gray-600 text-opacity-90 hover:text-gray-800 mb-2.5"
    >
      {children}
    </Link>
  );
};

export default DropdownLink;
