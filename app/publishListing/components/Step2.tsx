"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Town } from "@prisma/client";
import { ListingFormData } from "@/schemas/interfaces";
import { Step2Schema, type Step2Data } from "@/schemas/Step2Schema";

// Utility function to serialize category response
function serializeCategories(categories: any[]) {
  return categories.map((category) => ({
    ...category,
    id: Number(category.id),
    parentId: category.parentId ? Number(category.parentId) : null,
  }));
}

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
    categoryPath: string[];
    mainCategory?: Category;
    subCategory?: Category;
  }) => void;
  onBack: () => void;
  formData: ListingFormData;
}

export default function Step2({ onContinue, onBack, formData }: Step2Props) {
  const queryClient = useQueryClient();
  const [selectedMainId, setSelectedMainId] = useState<number | null>(null);
  const [selectedSubId, setSelectedSubId] = useState<number | null>(null);
  const [selectedFinalId, setSelectedFinalId] = useState<number | null>(null);
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  // Initialize state from formData if available
  useEffect(() => {
    if (formData) {
      setTown(formData.town || "");
      setAddress(formData.address || "");
      if (formData.mainCategory) {
        setSelectedMainId(formData.mainCategory.id);
      }
      if (formData.subCategory) {
        setSelectedSubId(formData.subCategory.id);
      }
      if (formData.subcategory_id) {
        setSelectedFinalId(formData.subcategory_id);
      }
    }
  }, [formData]);

  const { data: mainCategories = [], isLoading: isLoadingMain } = useQuery<
    Category[]
  >({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<Category[]>("/api/categories");
      return serializeCategories(response.data);
    },
    staleTime: 5 * 60,
  });

  const { data: towns, isLoading: isLoadingTowns } = useQuery<Town[]>({
    queryKey: ["towns"],
    queryFn: async () => {
      const response = await axios.get<Town[]>("/api/towns");
      return response.data;
    },
  });

  const { data: subCategories = [], isLoading: isLoadingSub } = useQuery<
    Category[]
  >({
    queryKey: ["categories", "sub", selectedMainId],
    queryFn: async () => {
      if (!selectedMainId) return [];
      const response = await axios.get<Category[]>(
        `/api/categories?parentId=${selectedMainId}`
      );
      return serializeCategories(response.data);
    },
    enabled: !!selectedMainId,
    staleTime: 5 * 60,
  });

  const { data: finalCategories = [], isLoading: isLoadingFinal } = useQuery<
    Category[]
  >({
    queryKey: ["categories", "final", selectedSubId],
    queryFn: async () => {
      if (!selectedSubId) return [];
      const response = await axios.get<Category[]>(
        `/api/categories?parentId=${selectedSubId}`
      );
      return serializeCategories(response.data);
    },
    enabled: !!selectedSubId,
    staleTime: 5 * 60,
  });

  const validateForm = () => {
    try {
      const finalId = selectedFinalId || selectedSubId;
      if (!finalId) {
        setErrors((prev) => ({
          ...prev,
          category: "Please select a category",
        }));
        return false;
      }

      if (!selectedMainId) {
        setErrors((prev) => ({
          ...prev,
          mainCategory: "Main category is required",
        }));
        return false;
      }

      Step2Schema.parse({
        subcategory_id: finalId,
        town,
        address,
        categoryPath: [
          mainCategories.find((c) => c.id === selectedMainId)?.name || "",
          subCategories.find((c) => c.id === selectedSubId)?.name || "",
          finalCategories.find((c) => c.id === selectedFinalId)?.name || "",
        ].filter(Boolean),
      });

      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: { [key: string]: string } = {};
      if (error.errors) {
        error.errors.forEach((err: any) => {
          formattedErrors[err.path[0]] = err.message;
        });
        setErrors(formattedErrors);
      }
      return false;
    }
  };

  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = Number(e.target.value);
    setSelectedMainId(id || null);
    setSelectedSubId(null);
    setSelectedFinalId(null);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.mainCategory;
      delete newErrors.category;
      return newErrors;
    });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value);
    setSelectedSubId(id || null);
    setSelectedFinalId(null);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.category;
      return newErrors;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(errors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    const finalId = selectedFinalId || selectedSubId;
    if (!finalId) return;

    const mainCategory = mainCategories.find((c) => c.id === selectedMainId);
    const subCategory = subCategories.find((c) => c.id === selectedSubId);

    onContinue({
      subcategory_id: finalId,
      town,
      address,
      categoryPath: [
        mainCategory?.name || "",
        subCategory?.name || "",
        finalCategories.find((c) => c.id === selectedFinalId)?.name || "",
      ].filter(Boolean),
      mainCategory,
      subCategory,
    });
  };

  // Prefetch functions remain the same
  const prefetchSubCategories = async (categoryId: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["categories", "sub", categoryId],
      queryFn: async () => {
        const response = await axios.get<Category[]>(
          `/api/categories?parentId=${categoryId}`
        );
        return serializeCategories(response.data);
      },
      staleTime: 5 * 60,
    });
  };

  const prefetchFinalCategories = async (categoryId: number) => {
    await queryClient.prefetchQuery({
      queryKey: ["categories", "final", categoryId],
      queryFn: async () => {
        const response = await axios.get<Category[]>(
          `/api/categories?parentId=${categoryId}`
        );
        return serializeCategories(response.data);
      },
      staleTime: 5 * 60,
    });
  };

  // Your existing return JSX with added error states
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
              {/* Main Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Main Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedMainId || ""}
                  onChange={handleMainCategoryChange}
                  className={`w-full border rounded-md p-2 bg-gray-50 ${
                    errors.mainCategory ? "border-red-500" : "border-gray-300"
                  }`}
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
                {errors.mainCategory && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.mainCategory}
                  </p>
                )}
              </div>

              {/* Sub Category */}
              {selectedMainId && !isLoadingSub && subCategories.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {
                      mainCategories.find((cat) => cat.id === selectedMainId)
                        ?.name
                    }{" "}
                    Categories <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedSubId || ""}
                    onChange={handleSubCategoryChange}
                    className={`w-full border rounded-md p-2 bg-gray-50 ${
                      errors.category ? "border-red-500" : "border-gray-300"
                    }`}
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
                  {errors.category && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.category}
                    </p>
                  )}
                </div>
              )}

              {/* Final Category */}
              {selectedSubId &&
                !isLoadingFinal &&
                finalCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specific Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={selectedFinalId || ""}
                      onChange={(e) =>
                        setSelectedFinalId(Number(e.target.value))
                      }
                      className={`w-full border rounded-md p-2 bg-gray-50 ${
                        errors.category ? "border-red-500" : "border-gray-300"
                      }`}
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

          {/* Location Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Town <span className="text-red-500">*</span>
                </label>
                <select
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                  className={`w-full border rounded-md p-2 bg-gray-50 ${
                    errors.town ? "border-red-500" : "border-gray-300"
                  }`}
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
                {errors.town && (
                  <p className="text-sm text-red-500 mt-1">{errors.town}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full border rounded-md p-2 bg-gray-50 ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter address"
                />
                {errors.address && (
                  <p className="text-sm text-red-500 mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
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
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
