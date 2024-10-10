import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Step2Props {
  onContinue: (data: { category: string; subcategories: string[]; address: string; town: string }) => void;
  onBack: () => void;
  formData: {
    category?: string;
    subcategories?: string[];
    address?: string;
    town?: string;
  };
}

interface CategoryWithChildren {
  id: string;
  name: string;
  children: {
    id: string;
    name: string;
  }[];
}

export default function Step2({ onContinue, onBack, formData }: Step2Props) {
  const [category, setCategory] = useState<string>(formData.category || '');
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(formData.subcategories || []);
  const [address, setAddress] = useState<string>(formData.address || '');
  const [town, setTown] = useState<string>(formData.town || '');

  const { isLoading, error, data: categories } = useQuery<CategoryWithChildren[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      try {
        const response = await axios.get<CategoryWithChildren[]>("/api/categories");
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            `Failed to fetch categories: ${
              error.response?.data?.error || error.message
            }`
          );
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  useEffect(() => {
    setCategory(formData.category || '');
    setSelectedSubcategories(formData.subcategories || []);
    setAddress(formData.address || '');
    setTown(formData.town || '');
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onContinue({ category, subcategories: selectedSubcategories, address, town });
  };

  const toggleSubcategory = (subcategoryName: string) => {
    setSelectedSubcategories(prev => 
      prev.includes(subcategoryName)
        ? prev.filter(name => name !== subcategoryName)
        : [...prev, subcategoryName]
    );
  };

  const selectedCategory = categories?.find(cat => cat.name === category);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-black">
          Categories & Location
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          Help us narrow down your search.
        </p>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          How does the matching thing work?
        </a>
        <div className="mt-8 hidden md:block">
          {/* SVG drawing of a person */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-32 md:w-48 h-32 md:h-48"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25h-1.5v-1.5h-1.5v1.5h-1.5v1.5h1.5v-1.5h1.5v-1.5z" />
          </svg>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="flex flex-col h-auto md:h-[700px]">
          <div className="flex-grow space-y-8">
            <div>
              <label htmlFor="category" className="block font-bold mb-2 text-black text-lg">
                Select a category
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Choose the category that best fits your project.
              </p>
              <select 
                id="category" 
                className="w-full border rounded-md p-2 text-black bg-gray-200"
                required
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSelectedSubcategories([]);
                }}
              >
                <option value="">Select a category</option>
                {isLoading ? (
                  <option value="" disabled>Loading categories...</option>
                ) : error ? (
                  <option value="" disabled>Error loading categories</option>
                ) : categories && categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No categories available</option>
                )}
              </select>
            </div>

            {selectedCategory && (
              <div>
                <label className="block font-bold mb-2 text-black text-lg">Subcategories</label>
                <p className="text-sm text-gray-600 mb-2">
                  Select subcategories that are relevant to your project.
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedCategory.children.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      type="button"
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedSubcategories.includes(subcategory.name)
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-black'
                      }`}
                      onClick={() => toggleSubcategory(subcategory.name)}
                    >
                      {subcategory.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:space-x-4">
              <div className="flex-grow mb-4 md:mb-0">
                <label htmlFor="address" className="block font-bold mb-2 text-black text-lg">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  className="w-full border rounded-md p-2 text-black bg-gray-200"
                  placeholder="Enter your address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="town" className="block font-bold mb-2 text-black text-lg">
                  Town
                </label>
                <select 
                  id="town" 
                  className="w-full border rounded-md p-2 text-black bg-gray-200"
                  required
                  value={town}
                  onChange={(e) => setTown(e.target.value)}
                >
                  <option value="">Select a town</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                  {/* Add more cities as needed */}
                </select>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-auto flex flex-col md:flex-row justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-gray-300 text-black px-8 py-3 rounded text-lg font-semibold mb-4 md:mb-0"
            >
              ← Back
            </button>
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded text-lg font-semibold"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
