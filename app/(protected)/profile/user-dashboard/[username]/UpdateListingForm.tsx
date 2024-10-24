import React, { useState, useCallback } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X, Pencil } from "lucide-react";
import { useQuery , useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { ExtendedListing } from "@/app/entities/ExtendedListing";
import { useRouter } from "next/navigation";
import { processListingImages } from "@/utils/imageUtils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Towns } from "@prisma/client";

interface Props {
  listing: ExtendedListing;
  onSuccess?: () => void;
  onCancel?: () => void;
  openModal: boolean;
  onOpenChangeModal: (open: boolean) => void;
}

interface FormData {
  title: string;
  description: string;
  category?: string;
  subcategory?: string;
  subSubcategory?: string;
  price?: string;
  budget: string;
  address: string;
  town: string;
  timeline: string;
  listingImages: string[];
}

interface Category {
  id: number;
  name: string;
  children?: Category[];
  description: string | null;
  parentId: number | null;
}

export default function UpdateListingForm({
  listing,
  onSuccess,
  onCancel,
  openModal,
  onOpenChangeModal,
}: Props) {
   const router = useRouter();
   const queryClient = useQueryClient();

  const {
    isLoading,
    error,
    data: categories,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get<Category[]>("/api/categories");
      return response.data;
    },
    staleTime: 1000 * 60 * 60,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: towns, isLoading: isLoadingTowns } = useQuery<Towns[]>({
      queryKey: ["towns"],
      queryFn: async () => {
        const response = await axios.get<Towns[]>("/api/towns");
        return response.data;
      },
      staleTime: 1000 * 60 * 60, // Cache for 1 hour
    });

  const [formData, setFormData] = useState<FormData>({
    title: listing.title,
    description: listing.description,
    //  category: listing.category.name,
    price: listing.price,
    budget: listing.budget?.toString() || "",
    address: listing.location?.split(", ")[1] || "",
    town: listing.location?.split(", ")[0] || "",
    timeline: listing.timeline || "",
    listingImages: listing.images.map((img) => img.imageUrl),
  });

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

  

  const handleUploadSuccess = (result: any) => {
    const imageUrl = result.info.secure_url;
    setFormData((prev) => ({
      ...prev,
      listingImages: [...(prev.listingImages || []), imageUrl],
    }));
  };

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
      // Process the images before submitting
      const processedImages = processListingImages(formData.listingImages);

      // Format the data to match the API expectations
      const submitData = {
        ...formData,
        listingImages: processedImages,
        location: `${formData.town}, ${formData.address}`,
        budget: parseFloat(formData.budget),
        category: formData.category || listing.category.name,
      };

      const response = await fetch(`/api/postListing/${listing.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update listing");
      }

      await response.json();

       router.refresh();

       // Invalidate and refetch queries
       await queryClient.invalidateQueries({
         predicate: (query) =>
           query.queryKey[0] === "listings" ||
           (query.queryKey[0] === "listing" &&
             query.queryKey[1] === listing.id),
       });


      toast.success("Listing updated successfully");

      // Close the modal
      onOpenChangeModal(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update listing"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = categories?.find(
    (cat) => cat.name === formData.category
  );

  const selectedSubcategory = selectedCategory?.children?.find(
    (subcat) => subcat.name === formData.subcategory
  );

  return (
    <Dialog
      // modal={false}

      open={openModal}
      onOpenChange={onOpenChangeModal}
    >
      <DialogTrigger asChild>
        <button className="absolute -top-4 left-0 bg-white rounded-full p-1.5 shadow-md z-20">
          <Pencil className="h-5 w-5 text-gray-600" />
        </button>
      </DialogTrigger>
      <DialogContent
        onInteractOutside={(event) => event.preventDefault()}
        className="max-w-3xl md:max-w-2xl"
      >
        <ScrollArea className="max-h-[90vh] px-1">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Update Listing</DialogTitle>
            </DialogHeader>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
              />
            </div>

            {/* <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          name="category"
          id="category"
          required
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
        >
          <option value="">Select a category</option>
          {categories?.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div> */}

            {selectedCategory?.children && (
              <div>
                <label
                  htmlFor="subcategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Subcategory
                </label>
                <select
                  name="subcategory"
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Select a subcategory</option>
                  {selectedCategory.children.map((subcat) => (
                    <option key={subcat.id} value={subcat.name}>
                      {subcat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedSubcategory?.children && (
              <div>
                <label
                  htmlFor="subSubcategory"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sub-subcategory
                </label>
                <select
                  name="subSubcategory"
                  id="subSubcategory"
                  value={formData.subSubcategory}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Select a sub-subcategory</option>
                  {selectedSubcategory.children.map((subsubcat) => (
                    <option key={subsubcat.id} value={subsubcat.name}>
                      {subsubcat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* <div>
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Select a town</option>
                  <option value="New York">New York</option>
                  <option value="Los Angeles">Los Angeles</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div> */}

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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Select a town</option>
                  {towns?.map((town) => (
                    <option key={town.id} value={town.name || ""}>
                      {town.name} {town.region && `(${town.region})`}
                    </option>
                  ))}
                  {isLoadingTowns && (
                    <p className="mt-1 text-sm text-gray-500">Loading towns...</p>
                  )}
                </select>
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                />
              </div>
            </div>

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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                >
                  <option value="">Select a timeline</option>
                  <option value="Less than 1 month">Less than 1 month</option>
                  <option value="1-3 months">1-3 months</option>
                  <option value="3-6 months">3-6 months</option>
                  <option value="More than 6 months">More than 6 months</option>
                </select>
              </div>

              {formData.budget !== "0.00" && (
                <div>
                  <label
                    htmlFor="budget"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Budget (XAF)
                  </label>
                  <input
                    type="text"
                    name="budget"
                    id="budget"
                    required
                    value={formData.budget}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value) || value === "") {
                        handleChange(e);
                      }
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                  />
                </div>
              )}
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
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-green-500 focus:outline-none focus:ring-green-500 sm:text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Listing Images
              </label>
              {formData.listingImages && formData.listingImages.length < 5 && (
                <div className="relative">
                  <CldUploadWidget
                    uploadPreset="lymdepzy"
                    options={{
                      styles: {
                        modal: {
                          zIndex: 99999,
                        },
                      },
                      sources: ["local", "url"],
                      multiple: true,
                      maxFiles: 5 - (formData.listingImages?.length || 0),
                    }}
                    onSuccess={handleUploadSuccess}
                  >
                    {({ open }) => (
                      <button
                        type="button"
                        onClick={() => open()}
                        className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Add Image ({formData.listingImages?.length || 0}/5)
                      </button>
                    )}
                  </CldUploadWidget>
                </div>
              )}

              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {formData.listingImages?.map((image, index) => (
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
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-text"
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
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
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
