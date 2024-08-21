"use client";

import dynamic from "next/dynamic";
import SignupModal from "./components/auth/SignupModal";
import SearchInput from "./components/SearchInput";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Logo from "./components/Logo";
import { EnvelopeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useEffect, useState } from "react";
// import SignInModal from "./components/auth/SignInModal";

const SignInModal = dynamic(() => import("./components/auth/SignInModal"), {
  ssr: false,
});

const Navbar = () => {
  const { status, data: session } = useSession();

  const handleSearch = (searchText: string) => console.log(searchText);

  return (
    <header className="border-b h-16 bg-white w-full">
      <nav className="flex justify-around sm:justify-between items-center sticky z-40 top-0 border-b h-16 bg-white gap-5 sm:gap-3 container mx-auto px-10 md:px-4 md:max-w-7xl">
        <div className="flex items-center gap-4 md:gap-7 w-full">
          <div className="flex items-center gap-3">
            <div className="xl:hidden">
              <Sidebar />
            </div>
            {/* logo */}
            <Link className="hidden sm:block" href="/">
              <Logo />
            </Link>
          </div>

          {/* <SearchInput /> */}
          <div className="hidden sm:block w-full md:max-w-lg lg:max-w-ful">
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>

        {/* logo */}
        <Link className="sm:hidden" href="/">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {/* dropdown */}
          <div className="hs-dropdown relative hidden md:inline-flex">
            <button
              id="hs-dropdown-with-icons"
              type="button"
              className="hs-dropdown-toggle whitespace-nowrap py-3 px-4 inline-flex items-center gap-x-2 font-bold text-black focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
              aria-haspopup="menu"
              aria-expanded="false"
              aria-label="Dropdown"
            >
              Post Ad
              <svg
                className="hs-dropdown-open:rotate-180 size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            <div
              className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 bg-white shadow-md rounded-lg p-1 space-y-0.5 mt-2 divide-y divide-gray-200 dark:bg-neutral-800 dark:border dark:border-neutral-700 dark:divide-neutral-700"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="hs-dropdown-with-icons"
            >
              <div className="py-2 first:pt-0 last:pb-0">
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                  </svg>
                  Newsletter
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="8" cy="21" r="1" />
                    <circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </svg>
                  Purchases
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                    <path d="M12 12v9" />
                    <path d="m8 17 4 4 4-4" />
                  </svg>
                  Downloads
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 dark:focus:bg-neutral-700"
                >
                  <svg
                    className="shrink-0 size-4"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Team Account
                </Link>
              </div>
            </div>
          </div>
          {/*notifications*/}
          <div className="hs-tooltip [--placement:bottom]">
            <button
              type="button"
              className="w-[2.375rem] hidden hs-tooltip-toggle h-[2.375rem] lg:inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
            >
              <svg
                className="flex-shrink-0 size-5"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-3 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                role="tooltip"
              >
                Notifications
              </span>
            </button>
          </div>
          {/* emails */}
          <div className="hs-tooltip [--placement:bottom]  md:inline-block">
            <button
              type="button"
              className="hs-dropdown-toggle hs-tooltip-toggle relative w-[2.375rem] h-[2.375rem] hidden lg:inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
              data-hs-offcanvas="#hs-offcanvas-right"
            >
              <EnvelopeIcon className="h-5 w-5" />
              <span className="absolute top-2 end-1 inline-flex items-center size-2.5 rounded-full border-2 border-white text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-pink-600 text-white">
                <span className="sr-only">Badge value</span>
              </span>
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-3 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                role="tooltip"
              >
                Messages
              </span>
            </button>
          </div>
          {/* lists */}
          <div className="hs-tooltip [--placement:bottom] hidden lg:inline-block">
            <button
              type="button"
              className="hs-dropdown-toggle hs-tooltip-toggle relative w-[2.375rem] h-[2.375rem] hidden lg:inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none "
              data-hs-offcanvas="#hs-offcanvas-right"
            >
              <HeartIcon className="h-5 w-5" />
              <span
                className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible z-10 py-3 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                role="tooltip"
              >
                Lists
              </span>
            </button>
          </div>
          {/* Nav links */}
          <Link
            href="#"
            className="text-gray-600 hover:text-green-600 hidden lg:inline-flex font-semibold whitespace-nowrap"
          >
            Oders
          </Link>

          {/* user profule */}
          <AuthStatus />
        </div>
      </nav>

      {/* sub header */}
      <Header />
      <SignInModal />
      <SignupModal />
    </header>
  );
};

const AuthStatus = () => {
  const { status, data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const closeDropdown = (e: MouseEvent): void => {
      const target = e.target as Element;
      if (!target.closest(".hs-dropdown")) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "click",
      closeDropdown as unknown as EventListener
    );
    return () =>
      document.removeEventListener(
        "click",
        closeDropdown as unknown as EventListener
      );
  }, []);

  if (status === "loading")
    return (
      <div className="w-[2.375rem] h-[2.375rem]">
        <Skeleton circle={true} height={38} width={38} />
      </div>
    );

  {
    /* singin and join links */
  }
  if (status === "unauthenticated")
    return (
      <>
        <button
          className="flex whitespace-nowrap text-gray-600  gap-2 items-center hover:text-green-500 font-semibold"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="hs-vertically-centered-modal"
          data-hs-overlay="#hs-vertically-centered-modal"
        >
          Sign In
        </button>
        <button
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="hs-signup-modal"
          data-hs-overlay="#hs-signup-modal"
          className="flex sm:text-green-500 gap-2 items-center font-medium text-base hover:opacity-80 sm:hover:text-white sm:hover:bg-green-500 sm:border sm:border-green-500 px-3 py-1 rounded-sm"
        >
          Join
        </button>
      </>
    );

  return (
    <div
      className="hs-dropdown relative inline-flex"
      data-hs-dropdown-placement="bottom-right"
    >
      <button
        onClick={toggleDropdown}
        type="button"
        className="hs-dropdown-toggle relative w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
      >
        {session!.user?.image ? (
          <Image
            width={38}
            height={38}
            className="inline-block size-[38px] rounded-full ring-2 ring-white dark:ring-neutral-900"
            src={session!.user.image}
            alt="Profile Image"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="inline-block size-[38px] rounded-full ring-2 ring-white dark:ring-neutral-900 bg-gray-200 text-lg font-semibold text-gray-600">
            {session!.user?.name?.[0].toUpperCase()}
          </div>
        )}
        <span className="absolute top-8 end-0 inline-flex items-center size-3 rounded-full border-2 border-white text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-green-500 text-white">
          <span className="sr-only">Online</span>
        </span>
      </button>

      {isOpen && (
        <div
          className={`hs-dropdown-menu absolute top-8 right-0 mt-2 transition-[opacity,margin] duration ${
            isOpen ? "opacity-100" : "opacity-0 hidden"
          } min-w-60 z-10 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700`}
          aria-labelledby="hs-dropdown-user-profile"
        >
          <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-700">
            <p className="text-sm text-gray-500 dark:text-neutral-400">
              Signed in as
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
              {session!.user!.name}
            </p>
          </div>
          <div className="mt-2 py-2 first:pt-0 last:pb-0">
            {["Profile", "Dashboard", "Post a Request", "Refer a Friend"].map(
              (item) => (
                <Link
                  key={item}
                  href="#"
                  className={`block py-2 px-3 rounded-lg text-gray-600 hover:text-green-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300 ${
                    item === "Refer a Friend" ? "text-green-500" : ""
                  }`}
                >
                  {item}
                </Link>
              )
            )}
            <hr className="my-2 border-gray-200 dark:border-neutral-700" />
            {["Settings", "Billing and payments"].map((item) => (
              <Link
                key={item}
                href="#"
                className="block py-2 px-3 rounded-lg text-gray-600 hover:text-green-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              >
                {item}
              </Link>
            ))}
            <hr className="my-2 border-gray-200 dark:border-neutral-700" />
            {["English", "$ USD", "Help & support"].map((item) => (
              <Link
                key={item}
                href="#"
                className="block py-2 px-3 rounded-lg text-gray-600 hover:text-green-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
              >
                {item}
              </Link>
            ))}
            <hr className="my-2 border-gray-200 dark:border-neutral-700" />

            <Link
              href="/api/auth/signout"
              className="block py-2 px-3 rounded-lg text-gray-600 hover:text-green-500 focus:outline-none focus:bg-gray-100 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
            >
              Logout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
