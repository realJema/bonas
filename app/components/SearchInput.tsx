"use client";

import React, { useState, useRef, useEffect, FormEvent } from "react";

interface Props {
  onSearch?: (searchText: string) => void;
}

const handleSearch = (searchText: string) => console.log(searchText);

const SearchInput = ({onSearch}:Props) => {
  const [searchText, setSearchText] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    "seo",
    "social media marketing",
    "facebook ads",
    "google ads",
    "logo design",
    "video editing",
    "data entry",
    "website development",
    "virtual assistant",
    "youtube thumbnail",
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
        setIsOverlayVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchText.trim()) {
      updateRecentSearches(searchText);
    }
  };

  const updateRecentSearches = (term: string) => {
    setRecentSearches((prev) =>
      [term, ...prev.filter((item) => item !== term)].slice(0, 5)
    );
  };

  const handleClear = () => {
    setRecentSearches([]);
  };

  const handleSearchClick = (term: string) => {
    setSearchText(term);
    updateRecentSearches(term);
  };

  return (
    <div className="relative w-full">
      {isOverlayVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30"></div>
      )}
      <form className="w-full mx-auto relative z-40" onSubmit={handleSubmit}>
        <div className="flex">
          <div className="relative w-full">
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-md border border-gray-300 focus:outline-none"
              placeholder="What service are you looking for today?"
              onFocus={() => {
                setIsDropdownVisible(true);
                setIsOverlayVisible(true);
              }}
              ref={inputRef}
            />
            <button
              type="submit"
              className="absolute top-0 right-0 p-2.5 text-sm font-medium h-full text-white bg-black rounded-r-md border border-black hover:bg-opacity-80 focus:outline-none"
            >
              <svg
                className="w-4 h-4"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
              <span className="sr-only">Search</span>
            </button>
          </div>
        </div>
      </form>

      {isDropdownVisible && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 bg-white p-4 mt-2 rounded-md shadow-lg z-40"
        >
          {recentSearches.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold">RECENT SEARCHES</h3>
                <button onClick={handleClear} className="text-blue-500 text-sm">
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearchClick(search)}
                    className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <h3 className="font-bold mb-2">POPULAR RIGHT NOW</h3>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearchClick(search)}
                  className="px-3 py-1 bg-gray-200 rounded-full text-sm"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;