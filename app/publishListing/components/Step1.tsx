"use client";

import { ListingFormData } from "@/schemas/interfaces";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "easymde/dist/easymde.min.css";
import type { Options } from "easymde";
import EditorSkeleton from "@/app/components/skeletons/EditorSkeleton";
import { Loader2, X } from "lucide-react";
import { marked } from 'marked';
import { Step1Data, Step1Schema } from "@/schemas/Step1Schema";
import axios from "axios";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
  loading: () => <EditorSkeleton />,
});

interface Step1Props {
  onContinue: (data: Step1Data) => void;
  formData: ListingFormData;
}

const MAX_LISTING_IMAGES = 5;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

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

export default function Step1({ onContinue, formData }: Step1Props) {
  const [title, setTitle] = useState(formData.title || "");
  const [description, setDescription] = useState(formData.description || "");
  const [coverImage, setCoverImage] = useState<string>(
    formData.cover_image || ""
  );
  const [listingImages, setListingImages] = useState<string[]>(
    formData.listingImages || []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    setTitle(formData.title || "");
    setDescription(formData.description || "");
    setCoverImage(formData.cover_image || "");
    setListingImages(formData.listingImages || []);
  }, [formData]);

  async function uploadToCloudinary(file: File): Promise<string> {
    try {
      // Get upload signature
      const signatureResponse = await fetch("/api/getUploadSignature");
      const { signature, timestamp, cloudName, apiKey, upload_preset, folder } =
        await signatureResponse.json();

      // Create form data
      const formData = new FormData();
      formData.append("file", file);
      formData.append("signature", signature);
      formData.append("timestamp", timestamp.toString());
      formData.append("api_key", apiKey);
      formData.append("folder", folder);
      formData.append("upload_preset", upload_preset);

      // Upload to Cloudinary
      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await uploadResponse.json();

      if (!data.secure_url) {
        throw new Error("No URL in upload response");
      }

      return data.secure_url;
    } catch (error: any) {
      console.error("Upload failed:", error);
      throw new Error("Failed to upload image");
    }
  }

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isCover: boolean
  ) => {
    const files = Array.from(e.target.files || []);

    if (isCover && files.length > 0) {
      await handleSingleImageUpload(files[0], true);
    } else {
      await handleMultipleImageUpload(files);
    }
  };

const handleSingleImageUpload = async (file: File, isCover: boolean) => {
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
    if (isCover) {
      setCoverImage(result);
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.cover_image;
        return newErrors;
      });
    }
  };
  reader.readAsDataURL(file);
};

const handleMultipleImageUpload = (files: File[]) => {
  const totalImages = files.length + listingImages.length;
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
      setListingImages((prev) => [...prev, result]);
    };
    reader.readAsDataURL(file);
  });
};

  const handleRemoveImage = (index: number) => {
    setListingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    try {
      Step1Schema.parse({
        title,
        description,
        cover_image: coverImage,
        listingImages,
      });
      setErrors({});
      return true;
    } catch (error: any) {
      const formattedErrors: { [key: string]: string } = {};
      error.errors.forEach((err: any) => {
        formattedErrors[err.path[0]] = err.message;
      });
      setErrors(formattedErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(errors).forEach((error) => {
        if (error) toast.error(error);
      });
      return;
    }

    const htmlDescription = marked(description);

    onContinue({
      title,
      description: htmlDescription,
      cover_image: coverImage,
      listingImages,
    });
  };

  // Your existing return JSX stays the same as it looks good
  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
      {/* Left Column */}
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Create Your Listing
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Start with a compelling title, description, and images to make your
          listing stand out.
        </p>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Images</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Cover Image Section - 1/3 width on large screens */}
              <div className="lg:col-span-1">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Cover Image <span className="text-red-500">*</span>
                  </label>

                  <div className="relative aspect-square w-full">
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
                            setErrors((prev) => ({
                              ...prev,
                              cover_image: "Cover image is required",
                            }));
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full 
                            opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <label
                        className={`w-full h-full flex flex-col items-center justify-center border-2 
                        border-dashed rounded-lg cursor-pointer
                        ${
                          errors.cover_image
                            ? "border-red-500"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
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
                          onChange={(e) => handleImageUpload(e, true)}
                        />
                      </label>
                    )}
                  </div>
                  {errors.cover_image && (
                    <p className="text-sm text-red-500">{errors.cover_image}</p>
                  )}
                </div>
              </div>

              {/* Listing Images Section - 2/3 width on large screens */}
              <div className="lg:col-span-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images (Optional)
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    {listingImages.map((image, index) => (
                      <div
                        key={index}
                        className="relative aspect-square w-full group"
                      >
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
                          <X size={16} />
                        </button>
                      </div>
                    ))}

                    {listingImages.length < MAX_LISTING_IMAGES && (
                      <label
                        className="aspect-square w-full flex flex-col items-center justify-center 
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
                            Add images ({listingImages.length}/
                            {MAX_LISTING_IMAGES})
                            {isUploading && " - Uploading..."}
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/jpg"
                          multiple
                          onChange={(e) => handleImageUpload(e, false)}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>
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
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.title;
                      return newErrors;
                    });
                  }}
                  className={`w-full border rounded-md p-2 text-black bg-gray-50 
                    ${errors.title ? "border-red-500" : "border-gray-300"}`}
                  placeholder="Enter a clear, descriptive title"
                />
                {errors.title ? (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                ) : (
                  <p className="text-sm mt-1 text-gray-500">
                    {title.length}/100 characters
                  </p>
                )}
              </div>

              {/* Description Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <SimpleMDE
                  value={description}
                  onChange={(value) => {
                    setDescription(value);
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.description;
                      return newErrors;
                    });
                  }}
                  options={editorOptions}
                />
                {errors.description ? (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-sm mt-1 text-gray-500">
                    {description.length}/1500 characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isUploading}
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                "Continue →"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}