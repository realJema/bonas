"use client";

import React, { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, Pencil, Loader2, Tag, Truck, HandCoins } from "lucide-react";
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
import { marked } from "marked";
import { AVAILABLE_TAGS } from "@/schemas/Step3Schema";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/app/publishListing/components/DatePicker";
import { addMonths } from "date-fns";

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
  subcategory_id?: number;
  price: string;
  currency: string;
  address: string;
  town: string;
  deadline: Date;
  cover_image?: string;
  listingImages: string[];
  tags: string[];
  negotiable: boolean;
  delivery_available: boolean;
  status: "active" | "inactive";
}

const editorOptions: Options = {
  spellChecker: true,
  autofocus: false,
  status: false,
  placeholder: "Describe your listing in detail (50-1500 characters)...",
  minHeight: "200px",
  maxHeight: "280px",
  toolbar: [
    "bold",
    "italic",
    "heading",
    "|",
    "quote",
    "unordered-list",
    "ordered-list",
  ] as Options["toolbar"],
  previewRender: (plainText: string) => {
    return marked(plainText); // Convert markdown to HTML for preview
  },
};

const MAX_LISTING_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

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
  const [coverImage, setCoverImage] = useState<string>(
    listing.cover_image || ""
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
      currency: listing.currency || "XAF",
      address: listing.address || "",
      town: listing.town || "",
      deadline: listing.deadline
        ? new Date(listing.deadline)
        : addMonths(new Date(), 2),
      cover_image: listing.cover_image || "",
      listingImages: Array.isArray(listing.images)
        ? listing.images.map((img) =>
            typeof img === "string" ? img : img.imageUrl
          )
        : [],
      tags: Array.isArray(listing.tags) ? listing.tags : [],
      negotiable: listing.negotiable === "1",
      delivery_available: listing.delivery_available === "1",
      status: (listing.status as "active" | "inactive") || "inactive",
    };
  }, [categories, listing]);

  const [formData, setFormData] = useState<FormData>(initializeFormData());

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

  // Image Handlers
  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        toast.error("Please upload only JPG or PNG images");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Image must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCoverImage(result);
        setFormData((prev) => ({
          ...prev,
          cover_image: result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleListingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = files.length + formData.listingImages.length;

    if (totalImages > MAX_LISTING_IMAGES) {
      toast.error(`Maximum ${MAX_LISTING_IMAGES} listing images allowed`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        toast.error(`${file.name} must be JPG or PNG`);
        return false;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        toast.error(`${file.name} must be less than 10MB`);
        return false;
      }
      return true;
    });

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          listingImages: [...prev.listingImages, result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setFormData((prev) => ({
      ...prev,
      listingImages: prev.listingImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }));
  };

  // Category Handlers
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

  // Form Handlers
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Get the final category ID
      const finalCategoryId =
        formData.subSubCategoryId ||
        formData.subCategoryId ||
        formData.mainCategoryId;
      if (!finalCategoryId) {
        throw new Error("Please select a category");
      }

      // Convert description to HTML
      const htmlDescription = marked(formData.description);

      const submitData = {
        ...formData,
        subcategory_id: finalCategoryId,
        price: parseFloat(formData.price),
        currency: "XAF",
        description: htmlDescription,
        deadline: formData.deadline.toISOString(),
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
        throw new Error(error.error || "Failed to update listing");
      }

      await response.json();
      await queryClient.invalidateQueries({ queryKey: ["listings"] });
      toast.success("Listing updated successfully");
      onOpenChangeModal(false);
      if (onSuccess) onSuccess();
      router.refresh();
    } catch (error) {
      console.error("Update error:", error);
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
            {/* Cover Image Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Cover Image</h2>
              <div className="relative aspect-square w-full max-w-sm mx-auto">
                {coverImage ? (
                  <div className="relative w-full h-full rounded-lg overflow-hidden group">
                    <Image
                      src={coverImage}
                      alt="Cover preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverImage("");
                        setFormData((prev) => ({
                          ...prev,
                          cover_image: "",
                        }));
                      }}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer hover:border-gray-400">
                    <div className="text-center p-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Upload cover image
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleCoverImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Listing Details</h2>
              <div className="space-y-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 text-black bg-gray-50"
                    placeholder="Enter a clear, descriptive title"
                  />
                </div>

                {/* Description Editor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <SimpleMDE
                    value={formData.description}
                    onChange={handleDescriptionChange}
                    options={editorOptions}
                  />
                </div>
              </div>
            </div>

            {/* Category Selection */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Category</h2>
              <div className="space-y-4">
                {/* Main Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.mainCategoryId || ""}
                    onChange={handleMainCategoryChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                  >
                    <option value="">Select main category</option>
                    {categories?.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sub Category */}
                {selectedMainCategory?.children && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subCategoryId || ""}
                      onChange={handleSubCategoryChange}
                      className="w-full border rounded-md p-2 bg-gray-50"
                    >
                      <option value="">Select sub category</option>
                      {selectedMainCategory.children.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Final Category */}
                {selectedSubCategory?.children && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Specific Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.subSubCategoryId || ""}
                      onChange={handleSubSubCategoryChange}
                      className="w-full border rounded-md p-2 bg-gray-50"
                    >
                      <option value="">Select specific category</option>
                      {selectedSubCategory.children.map((cat) => (
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
                    name="town"
                    value={formData.town}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                  >
                    <option value="">Select town</option>
                    {towns?.map((town) => (
                      <option key={town.id} value={town.name || ""}>
                        {town.name} {town.region && `(${town.region})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 bg-gray-50"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Price & Deadline */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Price & Deadline</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">XAF</span>
                    </div>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="block w-full rounded-md py-1.5 pl-12 pr-12 border border-gray-300"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Deadline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deadline <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    value={formData.deadline}
                    onChange={(date) => {
                      if (date) {
                        setFormData((prev) => ({
                          ...prev,
                          deadline: date,
                        }));
                      }
                    }}
                  />
                </div>
              </div>

              {/* Options */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="negotiable"
                      checked={formData.negotiable}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          negotiable: checked,
                        }))
                      }
                    />
                    <Label
                      htmlFor="negotiable"
                      className="flex items-center space-x-2"
                    >
                      <HandCoins className="h-4 w-4" />
                      <span>Open to Negotiation</span>
                    </Label>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="delivery"
                      checked={formData.delivery_available}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          delivery_available: checked,
                        }))
                      }
                    />
                    <Label
                      htmlFor="delivery"
                      className="flex items-center space-x-2"
                    >
                      <Truck className="h-4 w-4" />
                      <span>Delivery Service</span>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  Highlight Your Listing
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Select tags that best describe your listing
              </p>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter((t) => t !== tag)
                          : [...prev.tags, tag],
                      }));
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      formData.tags.includes(tag)
                        ? "bg-black text-white shadow-md transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              {formData.tags.length > 0 && (
                <p className="text-sm text-gray-600 mt-4">
                  {formData.tags.length} tags selected
                </p>
              )}
            </div>

            {/* Additional Images */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold mb-4">Additional Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {formData.listingImages.map((image, index) => (
                  <div key={index} className="relative group aspect-square">
                    <Image
                      src={image}
                      alt={`Listing image ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                      opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}

                {formData.listingImages.length < MAX_LISTING_IMAGES && (
                  <label
                    className="aspect-square flex flex-col items-center justify-center 
                  border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
                  >
                    <div className="text-center p-4">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="mt-1 text-sm text-gray-600">
                        Add images ({formData.listingImages.length}/
                        {MAX_LISTING_IMAGES})
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg"
                      multiple
                      onChange={handleListingImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
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



// import React, { useState, useCallback, useEffect } from "react";
// import Image from "next/image";
// import { X, Pencil, Camera } from "lucide-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { ExtendedListing } from "@/app/entities/ExtendedListing";
// import { useRouter } from "next/navigation";
// import dynamic from "next/dynamic";
// import "easymde/dist/easymde.min.css";
// import type { Options } from "easymde";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Town } from "@prisma/client";
// import EditorSkeleton from "@/app/components/skeletons/EditorSkeleton";

// const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
//   ssr: false,
//   loading: () => <EditorSkeleton />,
// });

// interface Props {
//   listing: ExtendedListing;
//   onSuccess?: () => void;
//   onCancel?: () => void;
//   openModal: boolean;
//   onOpenChangeModal: (open: boolean) => void;
// }

// interface Category {
//   id: number;
//   name: string;
//   description: string | null;
//   children?: Category[];
// }

// interface FormData {
//   title: string;
//   description: string;
//   mainCategoryId?: number;
//   subCategoryId?: number;
//   subSubCategoryId?: number;
//   price: string;
//   address: string;
//   town: string;
//   timeline: string;
//   listingImages: string[];
//   profileImage?: string | null;
// }

// const TIMELINE_OPTIONS = [
//   { value: "Less than 1 month", label: "Less than 1 month" },
//   { value: "1-3 months", label: "1-3 months" },
//   { value: "3-6 months", label: "3-6 months" },
//   { value: "More than 6 months", label: "More than 6 months" },
// ];

// const editorOptions: Options = {
//   spellChecker: true,
//   autofocus: false,
//   status: false,
//   placeholder: "Describe your listing in detail...",
//   minHeight: "200px",
//   maxHeight: "300px",
//   toolbar: [
//     "bold",
//     "italic",
//     "heading",
//     "|",
//     "quote",
//     "unordered-list",
//     "ordered-list",
//   ] as Options["toolbar"],
// };

// export default function UpdateListingForm({
//   listing,
//   onSuccess,
//   onCancel,
//   openModal,
//   onOpenChangeModal,
// }: Props) {
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [profileImage, setProfileImage] = useState<string>(
//     listing.user?.profilImage || ""
//   );
//   const [previewImage, setPreviewImage] = useState<string | null>(
//     listing.user?.profilImage || null
//   );

//   // Fetch categories with full tree
//   const { data: categories, isLoading: isLoadingCategories } = useQuery<
//     Category[]
//   >({
//     queryKey: ["categories", "all"],
//     queryFn: async () => {
//       const response = await axios.get<Category[]>("/api/categories?type=all");
//       return response.data;
//     },
//     staleTime: 1000 * 60 * 60, // 1 hour
//   });

//   // Fetch towns
//   const { data: towns, isLoading: isLoadingTowns } = useQuery<Town[]>({
//     queryKey: ["towns"],
//     queryFn: async () => {
//       const response = await axios.get<Town[]>("/api/towns");
//       return response.data;
//     },
//     staleTime: 1000 * 60 * 60,
//   });

//   const findCategoryPathById = useCallback(
//     (
//       categories: Category[] | undefined,
//       targetId: number
//     ): {
//       mainCategoryId?: number;
//       subCategoryId?: number;
//       subSubCategoryId?: number;
//     } => {
//       if (!categories) return {};

//       for (const mainCat of categories) {
//         if (mainCat.id === targetId) {
//           return { mainCategoryId: mainCat.id };
//         }

//         if (mainCat.children) {
//           for (const subCat of mainCat.children) {
//             if (subCat.id === targetId) {
//               return {
//                 mainCategoryId: mainCat.id,
//                 subCategoryId: subCat.id,
//               };
//             }

//             if (subCat.children) {
//               for (const subSubCat of subCat.children) {
//                 if (subSubCat.id === targetId) {
//                   return {
//                     mainCategoryId: mainCat.id,
//                     subCategoryId: subCat.id,
//                     subSubCategoryId: subSubCat.id,
//                   };
//                 }
//               }
//             }
//           }
//         }
//       }
//       return {};
//     },
//     []
//   );

//   const initializeFormData = useCallback(() => {
//     const categoryPath = categories
//       ? findCategoryPathById(categories, Number(listing.subcategory_id))
//       : {};

//     return {
//       title: listing.title || "",
//       description: listing.description || "",
//       mainCategoryId: categoryPath.mainCategoryId,
//       subCategoryId: categoryPath.subCategoryId,
//       subSubCategoryId: categoryPath.subSubCategoryId,
//       price: listing.price?.toString() || "",
//       address: listing.address || "",
//       town: listing.town || "",
//       timeline: listing.timeline || "",
//       listingImages: Array.isArray(listing.images)
//         ? listing.images.map((img) =>
//             typeof img === "string" ? img : img.imageUrl
//           )
//         : [],
//       profileImage: listing.user?.profilImage || null,
//     };
//   }, [categories, listing]);

//   const [formData, setFormData] = useState<FormData>(initializeFormData());

//   // Update form data when categories are loaded
//   useEffect(() => {
//     if (categories) {
//       setFormData(initializeFormData());
//     }
//   }, [categories, initializeFormData]);

//   const selectedMainCategory = categories?.find(
//     (cat) => cat.id === formData.mainCategoryId
//   );
//   const selectedSubCategory = selectedMainCategory?.children?.find(
//     (cat) => cat.id === formData.subCategoryId
//   );

//   const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
//         toast.error("Please upload only JPG or PNG images");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result as string;
//         setProfileImage(result);
//         setPreviewImage(result);
//         setFormData((prev) => ({
//           ...prev,
//           profileImage: result,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleListingImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (files) {
//       const currentCount = formData.listingImages?.length || 0;
//       const remainingSlots = 5 - currentCount;
//       const filesToProcess = Array.from(files).slice(0, remainingSlots);

//       filesToProcess.forEach((file) => {
//         if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
//           toast.error("Please upload only JPG or PNG images");
//           return;
//         }

//         const reader = new FileReader();
//         reader.onload = (e) => {
//           const result = e.target?.result as string;
//           setFormData((prev) => ({
//             ...prev,
//             listingImages: [...(prev.listingImages || []), result],
//           }));
//         };
//         reader.readAsDataURL(file);
//       });
//     }
//   };

//   const handleMainCategoryChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const id = parseInt(e.target.value);
//     setFormData((prev) => ({
//       ...prev,
//       mainCategoryId: id,
//       subCategoryId: undefined,
//       subSubCategoryId: undefined,
//     }));
//   };

//   const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const id = parseInt(e.target.value);
//     setFormData((prev) => ({
//       ...prev,
//       subCategoryId: id,
//       subSubCategoryId: undefined,
//     }));
//   };

//   const handleSubSubCategoryChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const id = parseInt(e.target.value);
//     setFormData((prev) => ({
//       ...prev,
//       subSubCategoryId: id,
//     }));
//   };

//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDescriptionChange = useCallback((value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       description: value,
//     }));
//   }, []);

//   const handleRemoveImage = (indexToRemove: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       listingImages: prev.listingImages?.filter(
//         (_, index) => index !== indexToRemove
//       ),
//     }));
//   };

// const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//   e.preventDefault();
//   setIsSubmitting(true);

//   try {
//     // Get the final category ID
//     let finalCategoryId: number | undefined;

//     if (formData.subSubCategoryId) {
//       finalCategoryId = formData.subSubCategoryId;
//     } else if (formData.subCategoryId) {
//       finalCategoryId = formData.subCategoryId;
//     } else if (formData.mainCategoryId) {
//       finalCategoryId = formData.mainCategoryId;
//     }

//     if (!finalCategoryId) {
//       throw new Error("Please select a category");
//     }

//     // Prepare images for submission
//     const processedListingImages = formData.listingImages
//       .map((img) => (img.startsWith("data:image/") ? img : null))
//       .filter(Boolean) as string[];

//     const submitData = {
//       ...formData,
//       subcategory_id: finalCategoryId,
//       price: parseFloat(formData.price),
//       currency: "XAF",
//       profileImage:
//         profileImage && profileImage.startsWith("data:image/")
//           ? profileImage
//           : null,
//       images: processedListingImages,
//     };

//     const response = await fetch(`/api/postListing/${listing.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(submitData),
//     });

//     if (!response.ok) {
//       const error = await response.json();
//       throw new Error(error.message || "Failed to update listing");
//     }

//     await response.json();
//     await queryClient.invalidateQueries({ queryKey: ["listings"] });
//     await queryClient.invalidateQueries({ queryKey: ["listing", listing.id] });

//     toast.success("Listing updated successfully");
//     onOpenChangeModal(false);
//     if (onSuccess) onSuccess();
//     router.refresh();
//   } catch (error) {
//     toast.error(
//       error instanceof Error ? error.message : "Failed to update listing"
//     );
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <Dialog open={openModal} onOpenChange={onOpenChangeModal}>
//       <DialogTrigger asChild>
//         <button className="absolute -top-4 left-0 bg-white rounded-full p-1.5 hover:bg-gray-100 shadow-md z-20">
//           <Pencil className="h-4 w-4 text-gray-600" />
//         </button>
//       </DialogTrigger>
//       <DialogContent
//         onInteractOutside={(event) => event.preventDefault()}
//         onOpenAutoFocus={(e) => e.preventDefault()}
//         className="max-w-xl sm:max-w-xl md:max-w-3xl xl:max-w-4xl shadow-xl"
//       >
//         <ScrollArea className="max-h-[80vh] sm:max-h-[90vh] py-3 sm:px-4 md:px-6">
//           <div className="p-6">
//             <DialogHeader>
//               <DialogTitle>Update Listing</DialogTitle>
//             </DialogHeader>
//           </div>
//           <form onSubmit={handleSubmit} className="space-y-6 p-6">
//             {/* Profile Image Section */}
//             <div className="bg-white p-6 rounded-lg shadow-sm border">
//               <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
//               <div className="flex flex-col items-center space-y-4">
//                 <div className="relative">
//                   {previewImage ? (
//                     <div className="relative w-32 h-32 rounded-full overflow-hidden">
//                       <Image
//                         src={previewImage}
//                         alt="Profile preview"
//                         fill
//                         className="object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setPreviewImage(null);
//                           setProfileImage("");
//                           setFormData((prev) => ({
//                             ...prev,
//                             profileImage: null,
//                           }));
//                         }}
//                         className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   ) : (
//                     <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
//                       <Camera className="h-8 w-8 text-gray-400" />
//                     </div>
//                   )}

//                   <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors">
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png,image/jpg"
//                       onChange={handleProfileImageUpload}
//                       className="hidden"
//                     />
//                     <Camera className="h-4 w-4" />
//                   </label>
//                 </div>
//                 <p className="text-sm text-gray-500">
//                   Add a profile image for your listing (optional)
//                 </p>
//               </div>
//             </div>

//             {/* Title Field */}
//             <div>
//               <label
//                 htmlFor="title"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Title
//               </label>
//               <input
//                 type="text"
//                 name="title"
//                 id="title"
//                 required
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//               />
//             </div>

//             {/* Description Field with Markdown Editor */}
//             <div>
//               <label
//                 htmlFor="description"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Description
//               </label>
//               <div className="mt-1">
//                 <SimpleMDE
//                   value={formData.description}
//                   onChange={handleDescriptionChange}
//                   options={editorOptions}
//                 />
//               </div>
//             </div>

//             {/* Category Selection Section */}
//             <div className="space-y-4">
//               {/* Main Category */}
//               <div>
//                 <label
//                   htmlFor="mainCategory"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Category
//                 </label>
//                 <select
//                   id="mainCategory"
//                   name="mainCategory"
//                   required
//                   value={formData.mainCategoryId || ""}
//                   onChange={handleMainCategoryChange}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                 >
//                   <option value="">Select a category</option>
//                   {categories?.map((cat) => (
//                     <option key={cat.id} value={cat.id}>
//                       {cat.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Subcategory - Only shown if main category is selected */}
//               {selectedMainCategory?.children &&
//                 selectedMainCategory.children.length > 0 && (
//                   <div>
//                     <label
//                       htmlFor="subCategory"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Subcategory
//                     </label>
//                     <select
//                       id="subCategory"
//                       name="subCategory"
//                       value={formData.subCategoryId || ""}
//                       onChange={handleSubCategoryChange}
//                       className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                     >
//                       <option value="">Select a subcategory</option>
//                       {selectedMainCategory.children.map((subcat) => (
//                         <option key={subcat.id} value={subcat.id}>
//                           {subcat.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//               {/* Sub-subcategory - Only shown if subcategory is selected */}
//               {selectedSubCategory?.children &&
//                 selectedSubCategory.children.length > 0 && (
//                   <div>
//                     <label
//                       htmlFor="subSubCategory"
//                       className="block text-sm font-medium text-gray-700"
//                     >
//                       Sub-subcategory
//                     </label>
//                     <select
//                       id="subSubCategory"
//                       name="subSubCategory"
//                       value={formData.subSubCategoryId || ""}
//                       onChange={handleSubSubCategoryChange}
//                       className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                     >
//                       <option value="">Select a sub-subcategory</option>
//                       {selectedSubCategory.children.map((subsubcat) => (
//                         <option key={subsubcat.id} value={subsubcat.id}>
//                           {subsubcat.name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}
//             </div>

//             {/* Location Section */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="town"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Town
//                 </label>
//                 <select
//                   id="town"
//                   name="town"
//                   required
//                   value={formData.town}
//                   onChange={handleChange}
//                   disabled={isLoadingTowns}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                 >
//                   <option value="">Select a town</option>
//                   {towns?.map((town) => (
//                     <option key={town.id} value={town.name || ""}>
//                       {town.name} {town.region && `(${town.region})`}
//                     </option>
//                   ))}
//                 </select>
//                 {isLoadingTowns && (
//                   <p className="mt-1 text-sm text-gray-500">Loading towns...</p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor="address"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   name="address"
//                   id="address"
//                   required
//                   value={formData.address}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                 />
//               </div>
//             </div>

//             {/* Timeline and Price Section */}
//             <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
//               <div>
//                 <label
//                   htmlFor="timeline"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   Timeline
//                 </label>
//                 <select
//                   id="timeline"
//                   name="timeline"
//                   required
//                   value={formData.timeline}
//                   onChange={handleChange}
//                   className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                 >
//                   <option value="">Select a timeline</option>
//                   {TIMELINE_OPTIONS.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {formData.price !== "0.00" && (
//                 <div>
//                   <label
//                     htmlFor="price"
//                     className="block text-sm font-medium text-gray-700"
//                   >
//                     Price (XAF)
//                   </label>
//                   <input
//                     type="text"
//                     name="price"
//                     id="price"
//                     required
//                     value={formData.price}
//                     onChange={(e) => {
//                       const value = e.target.value;
//                       if (/^\d*$/.test(value) || value === "") {
//                         handleChange(e);
//                       }
//                     }}
//                     className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
//                   />
//                 </div>
//               )}
//             </div>

//             {/* Listing Images Section */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700">
//                 Listing Images
//               </label>
//               <div className="mt-2">
//                 {formData.listingImages.length < 5 && (
//                   <label className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black cursor-pointer">
//                     <input
//                       type="file"
//                       accept="image/jpeg,image/png,image/jpg"
//                       onChange={handleListingImageUpload}
//                       multiple
//                       className="hidden"
//                     />
//                     Add Images ({formData.listingImages.length}/5)
//                   </label>
//                 )}
//               </div>

//               <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
//                 {formData.listingImages.map((image, index) => (
//                   <div key={index} className="relative group">
//                     <div className="relative aspect-w-1 aspect-h-1 h-36 w-full overflow-hidden rounded-lg bg-gray-200">
//                       <Image
//                         src={image}
//                         alt={`Listing image ${index + 1}`}
//                         fill
//                         className="object-cover"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveImage(index)}
//                         className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
//                       >
//                         <X className="h-4 w-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-3">
//               <button
//                 type="button"
//                 onClick={onCancel}
//                 disabled={isSubmitting}
//                 className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Updating...
//                   </span>
//                 ) : (
//                   "Update Listing"
//                 )}
//               </button>
//             </div>
//           </form>
//         </ScrollArea>
//       </DialogContent>
//     </Dialog>
//   );
// }
