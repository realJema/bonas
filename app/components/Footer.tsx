import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 container md:max-w-7xl py-10 px-4 sm:px-6 lg:px-8 mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-10">
        <div className="col-span-full hidden lg:col-span-1 lg:block">
          <Link
            className="flex-none text-base font-bold text-black"
            href="#"
            aria-label="Categories"
          >
            Categories
          </Link>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Graphics & Design
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Digital Marketing
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Writing & Translation
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Video & Animation
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Music & Audio
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Fiverr Logo Maker
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Programming & Tech
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Data
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Business
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Personal Growth & Hobbies
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Photography
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            End-to-End Projects
          </p>
          <p className="mt-3 text-[16px] text-gray-600 dark:text-neutral-400 hover:underline hover:cursor-pointer">
            Sitemap
          </p>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-gray-700 uppercase">
            About
          </h4>

          <div className="mt-3 grid space-y-3 text-[16px]">
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Careers
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Press & News
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Partnerships
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Privacy Policy
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Terms of Service
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Intellectual Property Claims
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Investor Relations
              </Link>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-gray-700 uppercase ">
            Support and Education
          </h4>

          <div className="mt-3 grid space-y-3 text-[16px]">
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Help & Support
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Trust & Safety
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Selling on Fiverr
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Buying on Fiverr
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Fiverr Guides
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Learn
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 
                 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Online Courses
              </Link>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-gray-700 uppercase dark:text-neutral-100">
            Community
          </h4>

          <div className="mt-3 grid space-y-3 text-[16px]">
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Customer Success Stories
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Community Hub
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Forum
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Events
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Blog
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Creators
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Affiliates
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Podcast
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Invite a Friend
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Become a Seller
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Community Standards
              </Link>
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-extrabold text-gray-700 uppercase dark:text-neutral-100">
            Business Solutions
          </h4>

          <div className="mt-3 grid space-y-3 text-[16px]">
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                About Business Solutions
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Fiverr Pro
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Fiverr Certified
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Become an Agency
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Fiverr Enterprise
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                ClearVoice
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Content Marketing
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Working Not Working
              </Link>
            </p>
            <p>
              <Link
                className="inline-flex gap-x-2 text-gray-600 hover:text-gray-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:underline hover:cursor-pointer"
                href="#"
              >
                Contact Sales
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="pt-5 mt-5 border-t border-gray-200 dark:border-neutral-700">
        <div className="sm:flex sm:justify-between sm:items-center">
          <div className="flex items-center gap-x-3">
            <div>
              <svg
                width="91"
                height="27"
                viewBox="0 0 91 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g fill="#7A7D85">
                  <path d="m82.9 13.1h-3.2c-2.1 0-3.2 1.5-3.2 4.1v9.3h-6.1v-13.4h-2.6c-2.1 0-3.2 1.5-3.2 4.1v9.3h-6.1v-18.4h6.1v2.8c1-2.2 2.4-2.8 4.4-2.8h7.4v2.8c1-2.2 2.4-2.8 4.4-2.8h2v5zm-25.6 5.6h-12.6c.3 2.1 1.6 3.2 3.8 3.2 1.6 0 2.8-.7 3.1-1.8l5.4 1.5c-1.3 3.2-4.6 5.1-8.5 5.1-6.6 0-9.6-5.1-9.6-9.5 0-4.3 2.6-9.4 9.2-9.4 7 0 9.3 5.2 9.3 9.1 0 .9 0 1.4-.1 1.8zm-5.9-3.5c-.1-1.6-1.3-3-3.3-3-1.9 0-3.1.8-3.4 3zm-23.1 11.3h5.3l6.7-18.3h-6.1l-3.2 10.7-3.4-10.8h-6.1zm-24.9 0h6v-13.4h5.7v13.4h6v-18.4h-11.6v-1.1c0-1.2.9-2 2.3-2h3.5v-5h-4.4c-4.5 0-7.5 2.7-7.5 6.6v1.5h-3.4v5h3.4z"></path>
                </g>
                <g fill="#7A7D85">
                  <path d="m90.4 23.3c0 2.1-1.6 3.7-3.8 3.7s-3.8-1.6-3.8-3.7 1.6-3.7 3.8-3.7c2.2-.1 3.8 1.5 3.8 3.7zm-.7 0c0-1.8-1.3-3.1-3.1-3.1s-3.1 1.3-3.1 3.1 1.3 3.1 3.1 3.1 3.1-1.4 3.1-3.1zm-1.7.8.1.9h-.7l-.1-.9c0-.3-.2-.5-.5-.5h-.8v1.4h-.7v-3.5h1.4c.7 0 1.2.4 1.2 1.1 0 .4-.2.6-.5.8.4.1.5.3.6.7zm-1.9-1h.7c.4 0 .5-.3.5-.5 0-.3-.2-.5-.5-.5h-.7z"></path>
                </g>
              </svg>
            </div>

            <p className="opacity-75 text-sm text-gray-700">
              © Fiverr International Ltd. 2024
            </p>
          </div>

          <div className="flex justify-between items-center">
            <div className="mt-3 sm:hidden">
              <a
                className="flex-none text-xl font-bold dark:text-white"
                href="#"
                aria-label="Brand"
              >
                Brand
              </a>
              <p className="mt-1 text-base sm:text-sm text-gray-600 dark:text-neutral-400">
                © 2022 Preline.
              </p>
            </div>

            <div className="space-x-4">
              <a
                className="inline-block text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                </svg>
              </a>
              <a
                className="inline-block text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </a>
              <a
                className="inline-block text-gray-500 hover:text-gray-800 dark:text-neutral-500 dark:hover:text-neutral-200"
                href="#"
              >
                <svg
                  className="flex-shrink-0 size-4"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M3.362 10.11c0 .926-.756 1.681-1.681 1.681S0 11.036 0 10.111C0 9.186.756 8.43 1.68 8.43h1.682v1.68zm.846 0c0-.924.756-1.68 1.681-1.68s1.681.756 1.681 1.68v4.21c0 .924-.756 1.68-1.68 1.68a1.685 1.685 0 0 1-1.682-1.68v-4.21zM5.89 3.362c-.926 0-1.682-.756-1.682-1.681S4.964 0 5.89 0s1.68.756 1.68 1.68v1.682H5.89zm0 .846c.924 0 1.68.756 1.68 1.681S6.814 7.57 5.89 7.57H1.68C.757 7.57 0 6.814 0 5.89c0-.926.756-1.682 1.68-1.682h4.21zm6.749 1.682c0-.926.755-1.682 1.68-1.682.925 0 1.681.756 1.681 1.681s-.756 1.681-1.68 1.681h-1.681V5.89zm-.848 0c0 .924-.755 1.68-1.68 1.68A1.685 1.685 0 0 1 8.43 5.89V1.68C8.43.757 9.186 0 10.11 0c.926 0 1.681.756 1.681 1.68v4.21zm-1.681 6.748c.926 0 1.682.756 1.682 1.681S11.036 16 10.11 16s-1.681-.756-1.681-1.68v-1.682h1.68zm0-.847c-.924 0-1.68-.755-1.68-1.68 0-.925.756-1.681 1.68-1.681h4.21c.924 0 1.68.756 1.68 1.68 0 .926-.756 1.681-1.68 1.681h-4.21z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
