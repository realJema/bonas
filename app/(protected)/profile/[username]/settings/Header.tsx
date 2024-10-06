"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import classNames from "classnames";

interface Props {
  username: string;
}

const Header = ({ username }: Props) => {
  const pathname = usePathname();

  const navLinks = [
    { href: `/profile/${username}/settings/contacts`, label: "Contacts" },
    { href: `/profile/${username}/settings/inbox`, label: "Inbox" },
    { href: `/profile/${username}/settings`, label: "Settings" },
  ];

  // Function to check if the current path is active
  const isActive = (path: string) => {
    if (path.endsWith("/settings")) {
      return pathname === path || pathname.startsWith(`${path}/`);
    }
    return pathname === path;
  };

  return (
    <header className="hidden border-b xl:px-0 md:block py-3 px-8">
      <div className="md:flex justify-between items-center container mx-auto px-5 md:px-8 md:max-w-7xl">
        <div className="flex space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classNames(
                "text-sm font-medium transition-colors hover:text-black",
                {
                  "text-black": isActive(link.href),
                  "text-gray-400": !isActive(link.href),
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <Button
          size="lg"
          className="text-white rounded-md bg-green-500 hover:bg-green-500 transition-colors hover:opacity-75 px-4"
        >
          Start Selling
        </Button>
      </div>
    </header>
  );
};

export default Header;
