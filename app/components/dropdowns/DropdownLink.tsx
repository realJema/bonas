// components/DropdownLink.tsx
import React from "react";
import Link from "next/link";

interface Props {
  href: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  children: React.ReactNode;
}

const DropdownLink = ({ href, onClick, children }: Props) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block text-gray-600 text-opacity-90 hover:text-gray-800 mb-2.5"
    >
      {children}
    </Link>
  );
};

export default DropdownLink;
