"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSearchListings } from "@/app/hooks/useSearchListings";
import { SearchIcon, Loader2, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/app/hooks/useDebounce";
import { useMediaQuery } from "@/app/hooks/useMediaQuery";
import { SearchSkeleton } from "@/app/components/skeletons/SearchSkeleton";
import { SearchFormInputs } from "@/app/types/search";
import { buildListingUrl } from "@/utils/categoryUtils";
import { DEFAULT_COVER_IMAGE } from "@/utils/imageUtils";

const Search = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const { register, watch, reset } = useForm<SearchFormInputs>({
    defaultValues: {
      searchTerm: searchParams.get("q") || "",
    },
  });

  const searchTerm = watch("searchTerm");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const { data, isLoading } = useSearchListings({
    searchTerm: debouncedSearchTerm,
    enabled: debouncedSearchTerm.length >= 2,
  });

  const navigateToListing = async (listing: ExtendedListing) => {
    if (isNavigating) return;

    setIsNavigating(true);
    try {
      const url = await buildListingUrl(listing);
      router.push(url);
      setIsOpen(false);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setIsNavigating(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={cn(
        "relative w-full",
        isMobile ? "max-w-full mx-4" : "max-w-md"
      )}
      ref={searchRef}
    >
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : (
            <SearchIcon className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          {...register("searchTerm")}
          className={cn(
            "py-3 ps-10 pe-12 block w-full border border-gray-300 rounded-lg",
            "text-sm focus:border-green-500 focus:ring-green-500",
            "placeholder:text-gray-400",
            "disabled:opacity-50 disabled:pointer-events-none",
            isMobile && "text-base"
          )}
          type="text"
          placeholder="Search listings..."
          aria-label="Search"
          onFocus={() => setIsOpen(true)}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              reset({ searchTerm: "" });
              setIsOpen(false);
            }}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && searchTerm && (
        <div
          className={cn(
            "absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50",
            isMobile ? "fixed left-4 right-4 top-full" : "w-full"
          )}
        >
          <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
            {isLoading ? (
              <SearchSkeleton />
            ) : data?.listings && data.listings.length > 0 ? (
              <div className="grid grid-cols-1 gap-1 p-1">
                {data.listings.map((listing: ExtendedListing) => (
                  <button
                    key={listing.id}
                    onClick={() => navigateToListing(listing)}
                    className={cn(
                      "flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md w-full transition-colors",
                      isMobile && "p-3"
                    )}
                    disabled={isNavigating}
                  >
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image
                        src={listing.cover_image || DEFAULT_COVER_IMAGE}
                        alt={listing.title || ""}
                        className="rounded-md object-cover"
                        fill
                        sizes="48px"
                        loading="lazy"
                      />
                    </div>
                    <span
                      className={cn(
                        "font-medium text-gray-900 truncate flex-1 text-left",
                        isMobile ? "text-base" : "text-sm"
                      )}
                    >
                      {listing.title}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                No listings found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;



// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { useSearchListings } from "@/app/hooks/useSearchListings";
// import { SearchIcon, Loader2, X } from "lucide-react";
// import { useRouter, useSearchParams, usePathname } from "next/navigation";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import Image from "next/image";
// import { cn } from "@/lib/utils";
// import { useDebounce } from "@/app/hooks/useDebounce";
// import { useMediaQuery } from "@/app/hooks/useMediaQuery";
// import { SearchSkeleton } from "@/app/components/skeletons/SearchSkeleton";
// import { SearchFormInputs } from "@/app/types/search";

// const Search = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const categories = pathname.split("/").filter(Boolean);
//   const searchRef = useRef<HTMLDivElement>(null);
//   const [isOpen, setIsOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 768px)");

//   const { register, watch, reset } = useForm<SearchFormInputs>({
//     defaultValues: {
//       searchTerm: searchParams.get("q") || "",
//     },
//   });

//   const searchTerm = watch("searchTerm");
//   const debouncedSearchTerm = useDebounce(searchTerm, 300);

//     const { data, isLoading } = useSearchListings({
//       searchTerm: debouncedSearchTerm,
//       mainCategory: categories[1],
//       enabled: debouncedSearchTerm.length >= 2,
//     });

//   const navigateToListing = (listing: ExtendedListing) => {
//     const currentCategory = categories[1] || "all";
//     const currentSubCategory = categories[2] || "all";
//     const currentSubSubCategory = categories[3] || "all";

//     router.push(
//       `/${currentCategory}/${currentSubCategory}/${currentSubSubCategory}/${listing.id}`,
//       { scroll: false }
//     );
//     setIsOpen(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         searchRef.current &&
//         !searchRef.current.contains(event.target as Node)
//       ) {
//         setIsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div
//       className={cn(
//         "relative w-full",
//         isMobile ? "max-w-full mx-4" : "max-w-md"
//       )}
//       ref={searchRef}
//     >
//       <div className="relative">
//         <div className="absolute inset-y-0 start-0 flex items-center ps-3.5">
//           {isLoading ? (
//             <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
//           ) : (
//             <SearchIcon className="h-4 w-4 text-gray-400" />
//           )}
//         </div>
//         <input
//           {...register("searchTerm")}
//           className={cn(
//             "py-3 ps-10 pe-12 block w-full border border-gray-300 rounded-lg",
//             "text-sm focus:border-green-500 focus:ring-green-500",
//             "placeholder:text-gray-400",
//             "disabled:opacity-50 disabled:pointer-events-none",
//             isMobile && "text-base" // Larger text on mobile
//           )}
//           type="text"
//           placeholder="Search listings..."
//           aria-label="Search"
//           onFocus={() => setIsOpen(true)}
//         />
//         {searchTerm && (
//           <button
//             type="button"
//             onClick={() => {
//               reset({ searchTerm: "" });
//               setIsOpen(false);
//             }}
//             className="absolute inset-y-0 right-0 flex items-center pr-3"
//           >
//             <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//           </button>
//         )}
//       </div>

//       {/* Search Results Dropdown */}
//       {isOpen && searchTerm && (
//         <div
//           className={cn(
//             "absolute mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50",
//             isMobile ? "fixed left-4 right-4 top-full" : "w-full"
//           )}
//         >
//           <div className="max-h-[60vh] overflow-y-auto overscroll-contain">
//             {isLoading ? (
//               <SearchSkeleton />
//             ) : data?.listings && data.listings.length > 0 ? (
//               <div className="grid grid-cols-1 gap-1 p-1">
//                 {data.listings.map((listing: ExtendedListing) => (
//                   <button
//                     key={listing.id}
//                     onClick={() => navigateToListing(listing)}
//                     className={cn(
//                       "flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md w-full transition-colors",
//                       isMobile && "p-3" // More padding on mobile
//                     )}
//                   >
//                     <div className="relative h-12 w-12 flex-shrink-0">
//                       <Image
//                         src={listing.cover_image || "/placeholder.png"}
//                         alt={listing.title || ""}
//                         className="rounded-md object-cover"
//                         fill
//                         sizes="48px"
//                         loading="lazy"
//                       />
//                     </div>
//                     <span
//                       className={cn(
//                         "font-medium text-gray-900 truncate flex-1 text-left",
//                         isMobile ? "text-base" : "text-sm"
//                       )}
//                     >
//                       {listing.title}
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <div className="p-4 text-center text-gray-500">
//                 No listings found
//               </div>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Search;
