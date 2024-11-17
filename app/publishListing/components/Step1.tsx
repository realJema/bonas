'use client'

import { ListingFormData } from "@/schemas/interfaces";
import Image from "next/image";
import dynamic from 'next/dynamic';
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "easymde/dist/easymde.min.css";
import type { Options } from "easymde";
import EditorSkeleton from "@/app/components/skeletons/EditorSkeleton"

const SimpleMDE = dynamic(
  () => import('react-simplemde-editor'),
  { 
    ssr: false,
    loading: () => <EditorSkeleton />
  }
);

interface Step1Props {
  onContinue: (data: {
    title: string;
    description: string;
    profileImage?: string;
  }) => void;
  formData: ListingFormData;
}

const editorOptions: Options = {
  spellChecker: true,
  autofocus: true,
  status: false,
  placeholder: "Describe your listing in detail (50-1500 characters)...",
  minHeight: "200px",
  maxHeight: "300px",
  toolbar: [
    'bold',
    'italic',
    'heading',
    '|',
    'quote',
    'unordered-list',
    'ordered-list'
  ] as Options["toolbar"]
};

export default function Step1({ onContinue, formData }: Step1Props) {
  const [title, setTitle] = useState(formData.title || "");
  const [description, setDescription] = useState(formData.description || "");
  const [profileImage, setProfileImage] = useState<string>(
    formData.profileImage || ""
  );
  const [previewImage, setPreviewImage] = useState<string | null>(
    formData.profileImage || null
  );

  useEffect(() => {
    setTitle(formData.title || "");
    setDescription(formData.description || "");
    setProfileImage(formData.profileImage || "");
    setPreviewImage(formData.profileImage || null);
  }, [formData]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate description length
    const plainTextDescription = description.replace(/(<([^>]+)>)/gi, "");
    if (plainTextDescription.length < 50) {
      toast.error("Description must be at least 50 characters long");
      return;
    }
    if (plainTextDescription.length > 1500) {
      toast.error("Description must not exceed 1500 characters");
      return;
    }

    onContinue({
      title,
      description,
      profileImage,
    });
  };


  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
      {/* Left Column */}
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Create Your Listing
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Start with a compelling title and description. Add a profile image to
          make your listing stand out.
        </p>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image Upload */}
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
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                )}

                <label className="absolute bottom-0 right-0 bg-black text-white rounded-full p-2 cursor-pointer hover:bg-gray-800 transition-colors">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </label>
              </div>
              <p className="text-sm text-gray-500">
                Add a profile image for your listing (optional)
              </p>
            </div>
          </div>

          {/* Title & Description */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Listing Details</h2>

            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border rounded-md p-2 text-black bg-gray-50"
                  placeholder="Enter a clear, descriptive title"
                  maxLength={100}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  {title.length}/100 characters
                </p>
              </div>

              {/* Description Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <SimpleMDE
                  value={description}
                  onChange={setDescription}
                  options={editorOptions}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {description.length}/1500 characters
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
