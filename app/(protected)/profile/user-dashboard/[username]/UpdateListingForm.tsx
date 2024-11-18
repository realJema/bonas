import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, Pencil, Camera } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import type { Options } from "easymde";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Town } from "@prisma/client";
import EditorSkeleton from "@/app/components/skeletons/EditorSkeleton";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface Props {
  listing: ExtendedListing;
  onSuccess?: () => void;
  onCancel?: () => void;
  openModal: boolean;
  onOpenChangeModal: (open: boolean) => void;
}

interface Category {
  id: number;
  name: string;
  description: string | null;
  children?: Category[];
}

interface FormData {
  title: string;
  description: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  subSubCategoryId?: number;
  price: string;
  address: string;
  town: string;
  timeline: string;
  listingImages: string[];
  profileImage?: string | null;
}

const TIMELINE_OPTIONS = [
  { value: "Less than 1 month", label: "Less than 1 month" },
  { value: "1-3 months", label: "1-3 months" },
  { value: "3-6 months", label: "3-6 months" },
  { value: "More than 6 months", label: "More than 6 months" },
];

const editorOptions: Options = {
  spellChecker: true,
  autofocus: false,
  status: false,
  placeholder: "Describe your listing in detail...",
  minHeight: "200px",
  maxHeight: "300px",
  toolbar: [
    "bold",
    "italic",
    "heading",
    "|",
    "quote",
    "unordered-list",
    "ordered-list",
  ] as Options["toolbar"],
};

export default function UpdateListingForm({
  listing,
  onSuccess,
  onCancel,
  openModal,
  onOpenChangeModal,
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    listing.user?.profilImage || ""
  );
  const [previewImage, setPreviewImage] = useState<string | null>(
    listing.user?.profilImage || null
  );

  // Fetch categories with full tree
  const { data: categories, isLoading: isLoadingCategories } = useQuery<
    Category[]
  >({
    queryKey: ["categories", "all"],
    queryFn: async () => {
      const response = await axios.get<Category[]>("/api/categories?type=all");
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch towns
  const { data: towns, isLoading: isLoadingTowns } = useQuery<Town[]>({
    queryKey: ["towns"],
    queryFn: async () => {
      const response = await axios.get<Town[]>("/api/towns");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });

  const findCategoryPathById = useCallback(
    (
      categories: Category[] | undefined,
      targetId: number
    ): {
      mainCategoryId?: number;
      subCategoryId?: number;
      subSubCategoryId?: number;
    } => {
      if (!categories) return {};

      for (const mainCat of categories) {
        if (mainCat.id === targetId) {
          return { mainCategoryId: mainCat.id };
        }

        if (mainCat.children) {
          for (const subCat of mainCat.children) {
            if (subCat.id === targetId) {
              return {
                mainCategoryId: mainCat.id,
                subCategoryId: subCat.id,
              };
            }

            if (subCat.children) {
              for (const subSubCat of subCat.children) {
                if (subSubCat.id === targetId) {
                  return {
                    mainCategoryId: mainCat.id,
                    subCategoryId: subCat.id,
                    subSubCategoryId: subSubCat.id,
                  };
                }
              }
            }
          }
        }
      }
      return {};
    },
    []
  );

  const initializeFormData = useCallback(() => {
    const categoryPath = categories
      ? findCategoryPathById(categories, Number(listing.subcategory_id))
      : {};

    return {
      title: listing.title || "",
      description: listing.description || "",
      mainCategoryId: categoryPath.mainCategoryId,
      subCategoryId: categoryPath.subCategoryId,
      subSubCategoryId: categoryPath.subSubCategoryId,
      price: listing.price?.toString() || "",
      address: listing.address || "",
      town: listing.town || "",
      timeline: listing.timeline || "",
      listingImages: Array.isArray(listing.images)
        ? listing.images.map((img) =>
            typeof img === "string" ? img : img.imageUrl
          )
        : [],
      profileImage: listing.user?.profilImage || null,
    };
  }, [categories, listing]);

  const [formData, setFormData] = useState<FormData>(initializeFormData());

  // Update form data when categories are loaded
  useEffect(() => {
    if (categories) {
      setFormData(initializeFormData());
    }
  }, [categories, initializeFormData]);

  const selectedMainCategory = categories?.find(
    (cat) => cat.id === formData.mainCategoryId
  );
  const selectedSubCategory = selectedMainCategory?.children?.find(
    (cat) => cat.id === formData.subCategoryId
  );

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        toast.error("Please upload only JPG or PNG images");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImage(result);
        setPreviewImage(result);
        setFormData((prev) => ({
          ...prev,
          profileImage: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentCount = formData.listingImages?.length || 0;
      const remainingSlots = 5 - currentCount;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
          toast.error("Please upload only JPG or PNG images");
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            listingImages: [...(prev.listingImages || []), result],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleMainCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      mainCategoryId: id,
      subCategoryId: undefined,
      subSubCategoryId: undefined,
    }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      subCategoryId: id,
      subSubCategoryId: undefined,
    }));
  };

  const handleSubSubCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      subSubCategoryId: id,
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDescriptionChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  }, []);

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      listingImages: prev.listingImages?.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Get the final category ID
    let finalCategoryId: number | undefined;

    if (formData.subSubCategoryId) {
      finalCategoryId = formData.subSubCategoryId;
    } else if (formData.subCategoryId) {
      finalCategoryId = formData.subCategoryId;
    } else if (formData.mainCategoryId) {
      finalCategoryId = formData.mainCategoryId;
    }

    if (!finalCategoryId) {
      throw new Error("Please select a category");
    }

    // Prepare images for submission
    const processedListingImages = formData.listingImages
      .map((img) => (img.startsWith("data:image/") ? img : null))
      .filter(Boolean) as string[];

    const submitData = {
      ...formData,
      subcategory_id: finalCategoryId,
      price: parseFloat(formData.price),
      currency: "XAF",
      profileImage:
        profileImage && profileImage.startsWith("data:image/")
          ? profileImage
          : null,
      images: processedListingImages,
    };

    const response = await fetch(`/api/postListing/${listing.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submitData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update listing");
    }

    await response.json();
    await queryClient.invalidateQueries({ queryKey: ["listings"] });
    await queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });

    toast.success("Listing updated successfully");
    onOpenChangeModal(false);
    if (onSuccess) onSuccess();
    router.refresh();
  } catch (error) {
    toast.error(
      error instanceof Error ? error.message : "Failed to update listing"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={openModal} onOpenChange={onOpenChangeModal}>
      <DialogTrigger asChild>
        <button className="absolute -top-4 left-0 bg-white rounded-full p-1.5 hover:bg-gray-100 shadow-md z-20">
          <Pencil className="h-4 w-4 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-w-xl sm:max-w-xl md:max-w-3xl xl:max-w-4xl shadow-xl"
      >
        <ScrollArea className="max-h-[80vh] sm:max-h-[90vh] py-3 sm:px-4 md:px-6">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Update Listing</DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Profile Image Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  {previewImage ? (
                    <div className="relative w-32 h-32 rounded-full overflow-hidden">
                      <Image
                        src={previewImage}
                        alt="Profile preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewImage(null);
                          setProfileImage("");
                          setFormData((prev) => ({
                            ...prev,
                            profileImage: null,
                          }));
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}

                  <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleProfileImageUpload}
                      className="hidden"
                    />
                    <Camera className="h-4 w-4" />
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Add a profile image for your listing (optional)
                </p>
              </div>
            </div>

            {/* Title Field */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>

            {/* Description Field with Markdown Editor */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <div className="mt-1">
                <SimpleMDE
                  value={formData.description}
                  onChange={handleDescriptionChange}
                  options={editorOptions}
                />
              </div>
            </div>

            {/* Category Selection Section */}
            <div className="space-y-4">
              {/* Main Category */}
              <div>
                <label
                  htmlFor="mainCategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="mainCategory"
                  name="mainCategory"
                  required
                  value={formData.mainCategoryId || ""}
                  onChange={handleMainCategoryChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory - Only shown if main category is selected */}
              {selectedMainCategory?.children &&
                selectedMainCategory.children.length > 0 && (
                  <div>
                    <label
                      htmlFor="subCategory"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subcategory
                    </label>
                    <select
                      id="subCategory"
                      name="subCategory"
                      value={formData.subCategoryId || ""}
                      onChange={handleSubCategoryChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    >
                      <option value="">Select a subcategory</option>
                      {selectedMainCategory.children.map((subcat) => (
                        <option key={subcat.id} value={subcat.id}>
                          {subcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              {/* Sub-subcategory - Only shown if subcategory is selected */}
              {selectedSubCategory?.children &&
                selectedSubCategory.children.length > 0 && (
                  <div>
                    <label
                      htmlFor="subSubCategory"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Sub-subcategory
                    </label>
                    <select
                      id="subSubCategory"
                      name="subSubCategory"
                      value={formData.subSubCategoryId || ""}
                      onChange={handleSubSubCategoryChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                    >
                      <option value="">Select a sub-subcategory</option>
                      {selectedSubCategory.children.map((subsubcat) => (
                        <option key={subsubcat.id} value={subsubcat.id}>
                          {subsubcat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
            </div>

            {/* Location Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="town"
                  className="block text-sm font-medium text-gray-700"
                >
                  Town
                </label>
                <select
                  id="town"
                  name="town"
                  required
                  value={formData.town}
                  onChange={handleChange}
                  disabled={isLoadingTowns}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                >
                  <option value="">Select a town</option>
                  {towns?.map((town) => (
                    <option key={town.id} value={town.name || ""}>
                      {town.name} {town.region && `(${town.region})`}
                    </option>
                  ))}
                </select>
                {isLoadingTowns && (
                  <p className="mt-1 text-sm text-gray-500">Loading towns...</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                />
              </div>
            </div>

            {/* Timeline and Price Section */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="timeline"
                  className="block text-sm font-medium text-gray-700"
                >
                  Timeline
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  required
                  value={formData.timeline}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                >
                  <option value="">Select a timeline</option>
                  {TIMELINE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.price !== "0.00" && (
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Price (XAF)
                  </label>
                  <input
                    type="text"
                    name="price"
                    id="price"
                    required
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === "") {
                        handleChange(e);
                      }
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  />
                </div>
              )}
            </div>

            {/* Listing Images Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Listing Images
              </label>
              <div className="mt-2">
                {formData.listingImages.length < 5 && (
                  <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleListingImageUpload}
                      multiple
                      className="hidden"
                    />
                    Add Images ({formData.listingImages.length}/5)
                  </label>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {formData.listingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative aspect-w-1 aspect-h-1 h-36 w-full overflow-hidden rounded-lg bg-gray-200">
                      <Image
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Updating...
                  </span>
                ) : (
                  "Update Listing"
                )}
              </button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
