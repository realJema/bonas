import React, { useState, useEffect } from "react";
import axios from "axios";

interface Category {
  id: number;
  name: string;
  description: string | null;
  parentId: number | null;
  createdAt: Date;
  updatedAt: Date;
}

interface CategorySelections {
  category: string;
  subcategory: string;
  subSubcategory: string;
}

interface Props {
  initialCategory: Category;
  onCategoryChange: (selections: CategorySelections) => void;
}

const CategoryManager = ({
  initialCategory,
  onCategoryChange,
}: Props) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedSubSubcategory, setSelectedSubSubcategory] =
    useState<string>("");
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [subSubcategories, setSubSubcategories] = useState<Category[]>([]);

  useEffect(() => {
    const findCategoryHierarchy = async () => {
      try {
        const response = await axios.get<Category[]>("/api/categories");
        const allCategories = response.data;
        setCategories(allCategories);

        if (initialCategory) {
          // Find the initial category and its hierarchy
          const mainCategory = allCategories.find(
            (cat) =>
              cat.id === initialCategory.id || cat.name === initialCategory.name
          );

          if (mainCategory) {
            setSelectedCategory(mainCategory.name);

            // Find all direct children of the main category
            const possibleSubcategories = allCategories.filter(
              (cat) => cat.parentId === mainCategory.id
            );
            setSubcategories(possibleSubcategories);

            // Find the actual subcategory
            const subCategory = possibleSubcategories.find((subCat) => {
              const subCatChildren = allCategories.filter(
                (cat) => cat.parentId === subCat.id
              );
              return subCatChildren.some(
                (child) => child.parentId === subCat.id
              );
            });

            if (subCategory) {
              setSelectedSubcategory(subCategory.name);

              // Find all children of the subcategory
              const possibleSubSubcategories = allCategories.filter(
                (cat) => cat.parentId === subCategory.id
              );
              setSubSubcategories(possibleSubSubcategories);

              // Find the actual sub-subcategory
              const subSubCategory = possibleSubSubcategories.find(
                (subSubCat) =>
                  allCategories.some((cat) => cat.parentId === subSubCat.id)
              );

              if (subSubCategory) {
                setSelectedSubSubcategory(subSubCategory.name);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    findCategoryHierarchy();
  }, [initialCategory]);

  const handleCategoryChange = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setSelectedSubcategory("");
    setSelectedSubSubcategory("");

    const category = categories.find((cat) => cat.name === categoryName);
    if (category) {
      const newSubcategories = categories.filter(
        (cat) => cat.parentId === category.id
      );
      setSubcategories(newSubcategories);
      setSubSubcategories([]);
    }

    onCategoryChange({
      category: categoryName,
      subcategory: "",
      subSubcategory: "",
    });
  };

  const handleSubcategoryChange = (subcategoryName: string) => {
    setSelectedSubcategory(subcategoryName);
    setSelectedSubSubcategory("");

    const subcategory = subcategories.find(
      (subcat) => subcat.name === subcategoryName
    );
    if (subcategory) {
      const newSubSubcategories = categories.filter(
        (cat) => cat.parentId === subcategory.id
      );
      setSubSubcategories(newSubSubcategories);
    }

    onCategoryChange({
      category: selectedCategory,
      subcategory: subcategoryName,
      subSubcategory: "",
    });
  };

  const handleSubSubcategoryChange = (subSubcategoryName: string) => {
    setSelectedSubSubcategory(subSubcategoryName);
    onCategoryChange({
      category: selectedCategory,
      subcategory: selectedSubcategory,
      subSubcategory: subSubcategoryName,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories
            .filter((cat) => !cat.parentId)
            .map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
        </select>
      </div>

      {/* {subcategories.length > 0 && ( */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <select
            value={selectedSubcategory}
            onChange={(e) => handleSubcategoryChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((subcat) => (
              <option key={subcat.id} value={subcat.name}>
                {subcat.name}
              </option>
            ))}
          </select>
        </div>
      {/* )} */}

      {/* {subSubcategories.length > 0 && ( */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sub-subcategory
          </label>
          <select
            value={selectedSubSubcategory}
            onChange={(e) => handleSubSubcategoryChange(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
          >
            <option value="">Select a sub-subcategory</option>
            {subSubcategories.map((subSubcat) => (
              <option key={subSubcat.id} value={subSubcat.name}>
                {subSubcat.name}
              </option>
            ))}
          </select>
        </div>
      {/* )} */}
    </div>
  );
};

export default CategoryManager;
