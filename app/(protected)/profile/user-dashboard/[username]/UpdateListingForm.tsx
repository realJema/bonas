

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

type ListingImage = string | { imageUrl: string };

interface Category {
  id: string;
  name: string;
  description: string | null;
  children?: Category[];
  parentId: string | null;
}

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
  id: string;
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

// Add the Cloudinary upload function
async function uploadToCloudinary(file: File): Promise<string> {
  try {
    const signatureResponse = await fetch("/api/getUploadSignature", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!signatureResponse.ok) {
      throw new Error(
        `Failed to get upload signature: ${signatureResponse.statusText}`
      );
    }

    const { signature, timestamp, cloudName, apiKey, upload_preset, folder } =
      await signatureResponse.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("signature", signature);
    formData.append("timestamp", timestamp.toString());
    formData.append("api_key", apiKey);
    formData.append("folder", folder);
    formData.append("upload_preset", upload_preset);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error(`Upload failed: ${uploadResponse.statusText}`);
    }

    const data = await uploadResponse.json();

    if (!data.secure_url) {
      throw new Error("No URL in upload response");
    }

    return data.secure_url;
  } catch (error: any) {
    console.error("Upload failed:", error);
    throw new Error(error.message || "Failed to upload image");
  }
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<string>(
    listing.cover_image || ""
  );
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadingImageIndexes, setUploadingImageIndexes] = useState<number[]>(
    []
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
      targetId: string // Accept string type
    ): {
      mainCategoryId?: number;
      subCategoryId?: number;
      subSubCategoryId?: number;
    } => {
      if (!categories || !targetId) return {};

      const findCategoryWithParents = (cats: Category[]): string[] | null => {
        for (const cat of cats) {
          if (cat.id === targetId) {
            return [cat.id];
          }

          if (cat.children) {
            const found = findCategoryWithParents(cat.children);
            if (found) {
              return [cat.id, ...found];
            }
          }
        }
        return null;
      };

      const path = findCategoryWithParents(categories);
      console.log("Found path array:", path);

      if (!path) return {};

      if (path.length === 3) {
        return {
          mainCategoryId: Number(path[0]),
          subCategoryId: Number(path[1]),
          subSubCategoryId: Number(path[2]),
        };
      } else if (path.length === 2) {
        return {
          mainCategoryId: Number(path[0]),
          subCategoryId: Number(path[1]),
        };
      } else if (path.length === 1) {
        return {
          mainCategoryId: Number(path[0]),
        };
      }

      return {};
    },
    []
  );

  useEffect(() => {
    if (categories && listing.subcategory_id) {
      const categoryPath = findCategoryPathById(
        categories,
        listing.subcategory_id // Pass directly as string
      );
      // console.log("Category path found:", categoryPath);
      setFormData((prev) => ({
        ...prev,
        ...categoryPath,
        subcategory_id: Number(listing.subcategory_id),
      }));
    }
  }, [categories, listing.subcategory_id, findCategoryPathById]);

  const initializeFormData = useCallback(() => {
    const categoryPath =
      categories && listing.subcategory_id
        ? findCategoryPathById(categories, listing.subcategory_id)
        : {};

    // Process images with proper type checking
    const listingImages = Array.isArray(listing.images)
      ? listing.images
          .map((img: ListingImage) => {
            if (typeof img === "string") return img;
            if (typeof img === "object" && img !== null && "imageUrl" in img) {
              return img.imageUrl;
            }
            return "";
          })
          .filter(Boolean)
      : [];

    console.log("Processed images during init:", listingImages);

    return {
      title: listing.title || "",
      description: listing.description || "",
      mainCategoryId: categoryPath.mainCategoryId,
      subCategoryId: categoryPath.subCategoryId,
      subSubCategoryId: categoryPath.subSubCategoryId,
      subcategory_id: Number(listing.subcategory_id) || undefined,
      price: listing.price?.toString() || "",
      currency: listing.currency || "XAF",
      address: listing.address || "",
      town: listing.town || "",
      deadline: listing.deadline
        ? new Date(listing.deadline)
        : addMonths(new Date(), 2),
      cover_image: listing.cover_image || "",
      listingImages, // Now properly typed as string[]
      tags: Array.isArray(listing.tags) ? listing.tags : [],
      negotiable: listing.negotiable === "1",
      delivery_available: listing.delivery_available === "1",
      status: (listing.status as "active" | "inactive") || "inactive",
    } satisfies FormData;
  }, [categories, listing, findCategoryPathById]);

  const [formData, setFormData] = useState<FormData>(() => {
    // Create initial form data with images
    const initialData = initializeFormData();
    console.log("Initial form data:", initialData);
    return initialData;
  });

 useEffect(() => {
   if (Array.isArray(listing.images) && listing.images.length > 0) {
     // Process images
     const processedImages = listing.images
       .map((img: ListingImage) => {
         if (typeof img === "string") return img;
         if (typeof img === "object" && img !== null && "imageUrl" in img) {
           return img.imageUrl;
         }
         return "";
       })
       .filter(Boolean);

     console.log("Updating listing images:", processedImages);

     // Update form data with new images
     setFormData((prev) => ({
       ...prev,
       listingImages: processedImages,
     }));
   }
 }, [listing.images]);

  // useEffect(() => {
  //   console.log("Listing images:", listing.images);
  //   console.log("Listing images type:", typeof listing.images);
  //   console.log("Is array?", Array.isArray(listing.images));
  // }, [listing]);

  // useEffect(() => {
  //   if (categories && listing.subcategory_id) {
  //     const categoryPath = findCategoryPathById(
  //       categories,
  //       String(listing.subcategory_id)
  //     );
  //     // console.log("Category path found in effect:", categoryPath);
  //     setFormData((prev) => ({
  //       ...prev,
  //       ...categoryPath,
  //       subcategory_id: Number(listing.subcategory_id),
  //     }));
  //   }
  // }, [categories, listing.subcategory_id, findCategoryPathById]);

  const selectedMainCategory = categories?.find(
    (cat) => cat.id === String(formData.mainCategoryId)
  );

  const selectedSubCategory = selectedMainCategory?.children?.find(
    (cat) => cat.id === String(formData.subCategoryId)
  );

  const handleCoverImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
      toast.error("Please upload only JPG or PNG images");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Image must be less than 10MB");
      return;
    }

    try {
      setIsUploadingCover(true);
      const uploadUrl = await uploadToCloudinary(file);
      setCoverImage(uploadUrl);
      setFormData((prev) => ({
        ...prev,
        cover_image: uploadUrl,
      }));
    } catch (error: any) {
      toast.error(error.message || "Failed to upload cover image");
    } finally {
      setIsUploadingCover(false);
    }
  };

  // const handleListingImageUpload = async (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const files = Array.from(e.target.files || []);
  //   const totalImages = files.length + formData.listingImages.length;

  //   if (totalImages > MAX_LISTING_IMAGES) {
  //     toast.error(`Maximum ${MAX_LISTING_IMAGES} listing images allowed`);
  //     return;
  //   }

  //   const validFiles = files.filter((file) => {
  //     if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
  //       toast.error(`${file.name} must be JPG or PNG`);
  //       return false;
  //     }
  //     if (file.size > MAX_IMAGE_SIZE) {
  //       toast.error(`${file.name} must be less than 10MB`);
  //       return false;
  //     }
  //     return true;
  //   });

  //   if (validFiles.length === 0) return;

  //   // Create placeholder spaces in the listingImages array
  //   const startIndex = formData.listingImages.length;
  //   setFormData((prev) => ({
  //     ...prev,
  //     listingImages: [
  //       ...prev.listingImages,
  //       ...Array(validFiles.length).fill(""),
  //     ],
  //   }));

  //   // Mark all new indexes as uploading
  //   const newIndexes = Array.from(
  //     { length: validFiles.length },
  //     (_, i) => startIndex + i
  //   );
  //   setUploadingImageIndexes(newIndexes);

  //   // Upload files
  //   for (let i = 0; i < validFiles.length; i++) {
  //     const file = validFiles[i];
  //     const currentIndex = startIndex + i;

  //     try {
  //       const uploadUrl = await uploadToCloudinary(file);
  //       setFormData((prev) => {
  //         const newImages = [...prev.listingImages];
  //         newImages[currentIndex] = uploadUrl;
  //         return {
  //           ...prev,
  //           listingImages: newImages,
  //         };
  //       });
  //     } catch (error: any) {
  //       // Remove the placeholder on error
  //       setFormData((prev) => ({
  //         ...prev,
  //         listingImages: prev.listingImages.filter(
  //           (_, idx) => idx !== currentIndex
  //         ),
  //       }));
  //       toast.error(`Failed to upload ${file.name}: ${error.message}`);
  //     } finally {
  //       setUploadingImageIndexes((prev) =>
  //         prev.filter((idx) => idx !== currentIndex)
  //       );
  //     }
  //   }
  // };

  // const handleRemoveImage = (indexToRemove: number) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     listingImages: prev.listingImages.filter(
  //       (_, index) => index !== indexToRemove
  //     ),
  //   }));
  // };

  const handleListingImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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

    if (validFiles.length === 0) return;

    // Create placeholder spaces while maintaining existing images
    const startIndex = formData.listingImages.length;
    setFormData((prev) => ({
      ...prev,
      listingImages: [
        ...prev.listingImages,
        ...Array(validFiles.length).fill(""),
      ],
    }));

    const newIndexes = Array.from(
      { length: validFiles.length },
      (_, i) => startIndex + i
    );
    setUploadingImageIndexes(newIndexes);

    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      const currentIndex = startIndex + i;

      try {
        const uploadUrl = await uploadToCloudinary(file);
        setFormData((prev) => {
          const newImages = [...prev.listingImages];
          newImages[currentIndex] = uploadUrl;
          return {
            ...prev,
            listingImages: newImages,
          };
        });
      } catch (error: any) {
        setFormData((prev) => ({
          ...prev,
          listingImages: prev.listingImages.filter(
            (_, idx) => idx !== currentIndex
          ),
        }));
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      } finally {
        setUploadingImageIndexes((prev) =>
          prev.filter((idx) => idx !== currentIndex)
        );
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    console.log("Removing image at index:", indexToRemove);
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
    const id = e.target.value ? Number(e.target.value) : undefined;
    console.log("Main category changed to:", id);
    setFormData((prev) => ({
      ...prev,
      mainCategoryId: id,
      subCategoryId: undefined,
      subSubCategoryId: undefined,
      subcategory_id: id,
    }));
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value);
    console.log("Sub category changed to:", id);
    setFormData((prev) => ({
      ...prev,
      subCategoryId: id || undefined,
      subSubCategoryId: undefined,
      subcategory_id: id || undefined,
    }));
  };

  const handleSubSubCategoryChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const id = parseInt(e.target.value);
    setFormData((prev) => ({
      ...prev,
      subSubCategoryId: id || undefined,
      subcategory_id: id || undefined,
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
      const finalCategoryId =
        formData.subSubCategoryId ||
        formData.subCategoryId ||
        formData.mainCategoryId;

      if (!finalCategoryId) {
        throw new Error("Please select a category");
      }

      const htmlDescription = marked(formData.description);

      // Ensure images are included correctly
      const submitData = {
        ...formData,
        subcategory_id: finalCategoryId,
        price: parseFloat(formData.price),
        currency: "XAF",
        description: htmlDescription,
        deadline: formData.deadline.toISOString(),
        cover_image: formData.cover_image,
        images: formData.listingImages, // Make sure images are properly included
      };

      console.log("Submitting data:", submitData);

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
                      {isUploadingCover ? (
                        <Loader2 className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
                      ) : (
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
                      )}
                      <p className="mt-1 text-sm text-gray-600">
                        {isUploadingCover
                          ? "Uploading..."
                          : "Upload cover image"}
                      </p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleCoverImageUpload}
                      disabled={isUploadingCover}
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
                    value={String(formData.mainCategoryId || "")}
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
                      value={String(formData.subCategoryId || "")}
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
                      value={String(formData.subSubCategoryId || "")}
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
                {formData.listingImages.map((image, index) => {
                  console.log(`Rendering image ${index}:`, image);
                  return (
                    <div key={index} className="relative aspect-square">
                      {uploadingImageIndexes.includes(index) ? (
                        <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
                        </div>
                      ) : (
                        <div className="relative group">
                          <Image
                            src={image}
                            alt={`Listing image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                            priority={true} // Add priority for faster loading
                            onError={(e) => {
                              console.error(
                                `Failed to load image ${index}:`,
                                image
                              );
                              e.currentTarget.src = "/placeholder-image.jpg";
                            }}
                            onLoad={() => {
                              console.log(`Successfully loaded image ${index}`);
                            }}
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
                      )}
                    </div>
                  );
                })}

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
                disabled={
                  isSubmitting ||
                  isUploadingCover ||
                  uploadingImageIndexes.length > 0
                }
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

