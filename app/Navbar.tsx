"use client";

import { EnvelopeIcon, HeartIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Sidebar from "./components/Sidebar";
import Image from "next/image";
import profileImg from "@/public/mdprofile.jpg";
import SearchInput from "./components/SearchInput";
import Header from "./components/Header";
import Logo from "./components/Logo";

const handleSearch = (searchText: string) => console.log(searchText);

const Navbar = () => {
  return (
    <header className="border-b h-16 bg-white px-6 xl:px-0">
      <nav className="flex justify-around sm:justify-between items-center sticky z-40 top-0 border-b h-16 bg-white gap-5 sm:gap-3 container mx-auto md:max-w-7xl">
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

          <Link
            href="#"
            className="text-green-600 hidden lg:inline-flex font-semibold whitespace-nowrap"
          >
            Switch to Selling
          </Link>

          {/* user profule */}
          <div className="hidden sm:flex flex-row items-center justify-end gap-2">
            <div
              className="hs-dropdown relative inline-flex"
              data-hs-dropdown-placement="bottom-right"
            >
              <button
                id="hs-dropdown-with-header"
                type="button"
                className="hs-dropdown-toggle relative w-[2.375rem] h-[2.375rem] inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700"
              >
                <Image
                  width={19}
                  height={19}
                  className="inline-block size-[38px] rounded-full ring-2 ring-white dark:ring-neutral-900"
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80"
                  alt="Image Description"
                />
                <span className="absolute top-8 end-0 inline-flex items-center size-3 rounded-full border-2 border-white text-xs font-medium transform -translate-y-1/2 translate-x-1/2 bg-green-500 text-white">
                  <span className="sr-only">Badge value</span>
                </span>
              </button>

              <div
                className="hs-dropdown-menu transition-[opacity,margin] duration hs-dropdown-open:opacity-100 opacity-0 hidden min-w-60 z-10 bg-white shadow-md rounded-lg p-2 dark:bg-neutral-800 dark:border dark:border-neutral-700"
                aria-labelledby="hs-dropdown-with-header"
              >
                <div className="py-3 px-5 -m-2 bg-gray-100 rounded-t-lg dark:bg-neutral-700">
                  <p className="text-sm text-gray-500 dark:text-neutral-400">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-gray-800 dark:text-neutral-300">
                    james@site.com
                  </p>
                </div>
                <div className="mt-2 py-2 first:pt-0 last:pb-0">
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="flex-shrink-0 size-4"
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
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="flex-shrink-0 size-4"
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
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <path d="M3 6h18" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    Purchases
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="flex-shrink-0 size-4"
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
                  </a>
                  <a
                    className="flex items-center gap-x-3.5 py-2 px-3 rounded-lg text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-300"
                    href="#"
                  >
                    <svg
                      className="flex-shrink-0 size-4"
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
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* sub header */}
      <Header />
    </header>
  );
};

export default Navbar;
