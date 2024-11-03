import { ListingFormData } from "@/schemas/interfaces";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState, useEffect } from "react";
import CloudinaryUpload from "./CloudinaryUpload/CloudinaryUpload";
import { toast } from "react-toastify";

interface Step1Props {
  onContinue: (data: {
    title: string;
    description: string;
    profileImage?: string;
  }) => void;
  formData: ListingFormData;
}

export default function Step1({ onContinue, formData }: Step1Props) {
  const [isUploading, setIsUploading] = useState(false);
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
       // Validate file type
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
      onContinue({ title, description, profileImage });
    };


  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-black">
          Let the matching begin…
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          This is where you fill us in on the big picture.
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
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-auto md:h-[700px]"
        >
          <div className="flex-grow space-y-8">
            {/* Image Upload Section */}
            <div>
              <label
                htmlFor="profileImage"
                className="block font-bold mb-2 text-black text-lg"
              >
                Profile Image
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Upload a profile image to personalize your listing
              </p>

              <div className="relative mb-4 block w-full cursor-pointer appearance-none rounded border border-dashed border-gray-400 bg-gray-50 px-4 py-4 hover:border-gray-600 transition-colors">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                />
                <div className="flex flex-col items-center justify-center space-y-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                  </span>
                  <p className="text-sm">
                    <span className="font-medium text-gray-900">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">JPG, PNG only</p>
                </div>
              </div>

              {/* Image Preview */}
              {previewImage && (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={previewImage}
                    alt="Profile preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="title"
                className="block font-bold mb-2 text-black text-lg"
              >
                Give your project brief a title
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Keep it short and simple – this will help us match you to the
                right category.
              </p>
              <div className="relative">
                <input
                  type="text"
                  id="title"
                  className="w-full border rounded-md p-2 pr-16 text-black bg-gray-200"
                  placeholder="Example: Create a WordPress website for my company"
                  maxLength={70}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <span className="absolute right-2 top-2 text-sm text-gray-400">
                  {title.length}/70
                </span>
              </div>
            </div>
            <div>
              <label
                htmlFor="description"
                className="block font-bold mb-2 text-black text-lg"
              >
                What are you looking to get done?
              </label>
              <p className="text-sm text-gray-600 mb-2">
                This will help get your brief to the right talent. Specifics
                help here.
              </p>
              <div className="relative">
                <textarea
                  id="description"
                  className="w-full border rounded-md p-2 h-64 text-black bg-gray-200"
                  placeholder="I need…"
                  maxLength={5000}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <span className="absolute right-2 bottom-2 text-sm text-gray-400">
                  {description.length}/2000
                </span>
              </div>
            </div>
          </div>
          <div className="mt-8 md:mt-auto text-right">
            <button
              type="submit"
              className="bg-black text-white px-8 py-3 rounded text-lg font-semibold w-full md:w-auto"
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
