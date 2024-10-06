"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import classNames from "classnames";

interface SettingsLink {
  href: string;
  label: string;
}

interface Props {
  username: string;
}

const SettingsPageSidebar = ({ username }: Props) => {
  const pathname = usePathname();

  const settingsLinks: SettingsLink[] = [
    { href: `/profile/${username}/settings/edit/account`, label: "Account" },
    { href: `/profile/${username}/settings/edit/security`, label: "Security" },
    {
      href: `/profile/${username}/settings/edit/notifications`,
      label: "Notifications",
    },
    {
      href: `/profile/${username}/settings/edit/business-information`,
      label: "Business Information",
    },
  ];

  const isActive = (path: string) => pathname === path;

  return (
      <aside className="w-full md:w-60 md:min-h-screen border-b border-gray-200">
        <nav className="sticky top-0 p-4">
          {settingsLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={classNames(
                "block py-2 px-4 rounded transition-colors hover:bg-gray-100 text-base hover:text-black",
                {
                  "text-black font-semibold": isActive(link.href),
                  "text-[#999999] font-medium": !isActive(link.href),
                }
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </aside>
  );
};

export default SettingsPageSidebar;
