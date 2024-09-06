import React from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  itemCount: number;
  pageSize: number;
  currentPage: number;
}

const Pagination = ({ itemCount, pageSize, currentPage }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageCount = Math.ceil(itemCount / pageSize);
  const displayCount = 9;
  const startPage =
    Math.floor((currentPage - 1) / displayCount) * displayCount + 1;
  const endPage = Math.min(startPage + displayCount - 1, pageCount);

  if (pageCount <= 1) return null;

  const changePage = (page: number) => {
    if (page < 1 || page > pageCount) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`w-8 h-8 text-xl cursor-pointer ${
            i === currentPage ? "border-b-2 border-black" : ""
          }`}
          onClick={() => changePage(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  const isLastPage = currentPage === pageCount;
  const isNoMoreListings = itemCount <= currentPage * pageSize;

  return (
    <div className="flex items-center justify-center space-x-4">
      <button
        className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${
          currentPage === 1
            ? "opacity-50 cursor-text"
            : "hover:bg-gray-300"
        }`}
        onClick={() => changePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ArrowLeftIcon className="w-5 h-5" />
      </button>
      {renderPageNumbers()}
      <button
        className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${
          isLastPage || isNoMoreListings
            ? "opacity-50 cursor-text"
            : "hover:bg-gray-300"
        }`}
        onClick={() => changePage(currentPage + 1)}
        disabled={isLastPage || isNoMoreListings}
      >
        <ArrowRightIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;
