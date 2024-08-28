// components/UserProfile.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
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

interface UserProfileProps {
  session: Session | null;
}

export function UserProfile({ session }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

    const handleSignOut = async () => {
      await signOut({ callbackUrl: "/" });
    };

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
          {["Profile", "Dashboard", "Post a Request", "Refer a Friend"].map(
            (item) => (
              <DropdownMenuItem key={item} asChild>
                <Link
                  href="#"
                  className={
                    item === "Refer a Friend"
                      ? "text-green-500 cursor-pointer"
                      : "cursor-pointer"
                  }
                >
                  {item}
                </Link>
              </DropdownMenuItem>
            )
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {["Settings", "Billing and payments"].map((item) => (
            <DropdownMenuItem key={item} asChild>
              <Link className="cursor-pointer" href="#">
                {item}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {["English", "$ USD", "Help & support"].map((item) => (
            <DropdownMenuItem key={item} asChild>
              <Link className="cursor-pointer" href="#">
                {item}
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
