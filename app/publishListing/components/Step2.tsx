'use client'

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Town } from "@prisma/client";

interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
}

interface Step2Props {
  onContinue: (data: {
    subcategory_id: number;
    town: string;
    address: string;
  }) => void;
  onBack: () => void;
}

export default function Step2({ onContinue, onBack }: Step2Props) {
  const queryClient = useQueryClient();
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");

  const { 
    data: mainCategories = [], 
    isLoading: isLoadingMain 
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<Category[]>("/api/categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
    // cacheTime: 1000 * 60 * 60 * 24,
  });

   const { data: towns, isLoading: isLoadingTowns } = useQuery<Town[]>({
     queryKey: ["towns"],
     queryFn: async () => {
       const response = await axios.get<Town[]>("/api/towns");
       return response.data;
     },
   });


  const { 
    data: subCategories = [], 
    isLoading: isLoadingSub 
  } = useQuery<Category[]>({
    queryKey: ["categories", "sub", selectedMainId],
    queryFn: async () => {
      if (!selectedMainId) return [];
      const response = await axios.get<Category[]>(`/api/categories?parentId=${selectedMainId}`);
      return response.data;
    },
    enabled: !!selectedMainId,
    staleTime: 1000 * 60 * 60,
    // cacheTime: 1000 * 60 * 60 * 24,
  });

  const { 
    data: finalCategories = [], 
    isLoading: isLoadingFinal 
  } = useQuery<Category[]>({
    queryKey: ["categories", "final", selectedSubId],
    queryFn: async () => {
      if (!selectedSubId) return [];
      const response = await axios.get<Category[]>(`/api/categories?parentId=${selectedSubId}`);
      return response.data;
    },
    enabled: !!selectedSubId,
    staleTime: 1000 * 60 * 60,
    // cacheTime: 1000 * 60 * 60 * 24,
  });


  const prefetchSubCategories = async (categoryId: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["categories", "sub", categoryId],
      queryFn: async () => {
        const response = await axios.get<Category[]>(`/api/categories?parentId=${categoryId}`);
        return response.data;
      },
      staleTime: 1000 * 60 * 60,
    });
  };

  const prefetchFinalCategories = async (categoryId: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["categories", "final", categoryId],
      queryFn: async () => {
        const response = await axios.get<Category[]>(`/api/categories?parentId=${categoryId}`);
        return response.data;
      },
      staleTime: 1000 * 60 * 60,
    });
  };

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedMainId(id || null);
    setSelectedSubId(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalId = selectedSubId;
    if (!finalId) {
      toast.error("Please select a specific category");
      return;
    }

    if (!town) {
      toast.error("Please select a town");
      return;
    }

    if (!address) {
      toast.error("Please provide an address");
      return;
    }

    onContinue({
      subcategory_id: finalId,
      town,
      address,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Categories & Location
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Choose a category and location for your listing.
        </p>
      </div>

      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Select Category</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category
                </label>
                <select
                  value={selectedMainId || ""}
                  onChange={handleMainCategoryChange}
                  className="w-full border rounded-md p-2 bg-gray-50"
                  // disabled={isLoadingMain}
                  required
                >
                  {isLoadingMain ? (
                    <option>Loading Categories...</option>
                  ) : (
                    <>
                      <option value="">Select main category</option>
                      {mainCategories.map((cat) => (
                        <option
                          key={cat.id}
                          value={cat.id}
                          onMouseEnter={() => prefetchSubCategories(cat.id)}
                        >
                          {cat.name}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {selectedMainId && !isLoadingSub && subCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {
                      mainCategories.find((cat) => cat.id === selectedMainId)
                        ?.name
                    }{" "}
                    Categories
                  </label>
                  <select
                    value={selectedSubId || ""}
                    onChange={(e) => setSelectedSubId(Number(e.target.value))}
                    className="w-full border rounded-md p-2 bg-gray-50"
                    required
                  >
                    <option value="">
                      Select{" "}
                      {
                        mainCategories.find((cat) => cat.id === selectedMainId)
                          ?.name
                      }{" "}
                      category
                    </option>
                    {subCategories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                        onMouseEnter={() => prefetchFinalCategories(cat.id)}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {selectedSubId &&
                !isLoadingFinal &&
                finalCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specific Category
                    </label>
                    <select
                      className="w-full border rounded-md p-2 bg-gray-50"
                      required
                    >
                      <option value="">Select specific category</option>
                      {finalCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Town Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Town
                </label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className="w-full border rounded-md p-2 bg-gray-50"
                  required
                >
                  <option value="">Select town</option>
                  {isLoadingTowns ? (
                    <option disabled>Loading towns...</option>
                  ) : (
                    towns?.map((t) => (
                      <option key={t.id} value={t.name || ""}>
                        {t.name} {t.region && `(${t.region})`}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded-md p-2 bg-gray-50"
                  placeholder="Enter address"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
              disabled={!selectedSubId}
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}