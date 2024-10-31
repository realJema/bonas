"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

type FormData = {
  searchReviews: string;
};

const SearchReviews = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log("Searching for:", data.searchReviews);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative w-full max-w-lg"
    >
      <input
        {...register("searchReviews")}
        type="text"
        className="block p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 transition-all duration-200 ease-in-out"
        placeholder="Search reviews..."
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black rounded-full transition-all duration-200 ease-in-out"
      >
        <Search className="w-5 h-5" />
        <span className="sr-only">Search reviews</span>
      </button>
    </form>
  );
};

export default SearchReviews;
