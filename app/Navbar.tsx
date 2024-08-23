"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { EnvelopeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Sidebar from "./components/Sidebar";
import Logo from "./components/Logo";
import SearchInput from "./components/SearchInput";
import Header from "./components/Header";
import SignInModal from "./components/auth/SignInModal";
import SignupModal from "./components/auth/SignupModal";
import { PostDropdownMenu } from "./components/PostDropdownMenu";

interface ModalState {
  type: "signin" | "signup" | null;
}

const Navbar = () => {
  const [modalState, setModalState] = useState<ModalState>({ type: null });
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleSearch = (searchText: string) => console.log(searchText);

  return (
    <header className="border-b h-16 bg-white w-full">
      <nav className="flex justify-around sm:justify-between items-center sticky z-40 top-0 border-b h-16 bg-white gap-5 sm:gap-3 container mx-auto px-10 md:px-4 md:max-w-7xl">
        <div className="flex items-center gap-4 md:gap-7 w-full">
          <div className="flex items-center gap-3">
            <div className="xl:hidden">
              <Sidebar />
            </div>
            <Link className="hidden sm:block" href="/">
              <Logo />
            </Link>
          </div>
          <div className="hidden sm:block w-full md:max-w-lg lg:max-w-full">
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>

        <Link className="sm:hidden" href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {/* <DropdownMenu onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="font-bold">
                Post Ad
                <svg
                  className={`ml-2 h-4 w-4 transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Newsletter
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  Purchases
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                  Downloads
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3"
                >
                  <svg
                    className="flex-shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Team Account
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <PostDropdownMenu />

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Notifications"
          >
            <svg
              className="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Messages"
          >
            <EnvelopeIcon className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:inline-flex"
            aria-label="Lists"
          >
            <HeartIcon className="h-5 w-5" />
          </Button>

          <Link
            href="#"
            className="text-gray-600 hover:text-green-600 hidden lg:inline-flex font-semibold whitespace-nowrap"
          >
            Orders
          </Link>

          <button
            onClick={() => setModalState({ type: "signin" })}
            className="flex whitespace-nowrap text-gray-600 gap-2 items-center hover:text-green-500 font-semibold"
          >
            Sign In
          </button>
          <Button
            onClick={() => setModalState({ type: "signup" })}
            variant="outline"
            className="flex sm:text-green-500 gap-2 items-center font-medium text-base hover:opacity-80 sm:hover:text-white sm:hover:bg-green-500 sm:border sm:border-green-500 px-3 py-1 rounded-sm"
          >
            Join
          </Button>
        </div>
      </nav>

      <Header />

      <SignInModal
        isOpen={modalState.type === "signin"}
        onClose={() => setModalState({ type: null })}
        switchToSignup={() => setModalState({ type: "signup" })}
      />
      <SignupModal
        isOpen={modalState.type === "signup"}
        onClose={() => setModalState({ type: null })}
        switchToSignin={() => setModalState({ type: "signin" })}
      />
    </header>
  );
};

export default Navbar;
