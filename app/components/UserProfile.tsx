"use client";
import { useState } from "react";
import Link from "next/link";
import { Session } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import { formatUsername } from "@/utils/formatUsername";

interface UserProfileProps {
  session: Session | null;
}

export function UserProfile({ session }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const formattedUsername = formatUsername(session.user.name);

  const menuItems = [
    {
      label: "Profile",
      href: `/profile/user-dashboard/${formattedUsername}`,
      disabled: false,
    },
    { label: "Dashboard", href: "#", disabled: true },
    { label: "Post a Request", href: "#", disabled: false },
    { label: "Refer a Friend", href: "#", disabled: true },
    {
      label: "Settings",
      href: `/profile/${formattedUsername}/settings/edit/account`,
      disabled: false,
    },
    { label: "Billing and payments", href: "#", disabled: true },
    { label: "English", href: "#", disabled: false },
    { label: "$ USD", href: "#", disabled: false },
    { label: "Help & support", href: "#", disabled: false },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className="relative w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center rounded-full text-sm font-semibold text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-white transition-all">
          <Avatar className="w-[38px] h-[38px]">
            <AvatarImage
              src={session.user.image || undefined}
              alt="Profile"
              referrerPolicy="no-referrer"
            />
            <AvatarFallback>
              {session.user.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {menuItems.map((item) => (
            <DropdownMenuItem key={item.label} asChild>
              <Link
                href={item.href}
                className={`${
                  item.disabled
                    ? "cursor-text opacity-50"
                    : item.label === "Refer a Friend"
                    ? "text-green-500 cursor-pointer"
                    : "cursor-pointer"
                }`}
                onClick={(e) => {
                  if (item.disabled) {
                    e.preventDefault();
                  }
                }}
              >
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button
            onClick={handleSignOut}
            className="w-full text-left cursor-pointer"
          >
            Logout
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
