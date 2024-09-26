import { create } from "zustand";
import { Category } from "@prisma/client";

export type CategoryWithChildren = Category & {
  children: (Category & {
    children: Category[];
  })[];
};

interface CategoryStore {
  categories: CategoryWithChildren[];
  isLoading: boolean;
  setCategories: (categories: CategoryWithChildren[]) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  isLoading: true,
  setCategories: (categories) => set({ categories, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));
