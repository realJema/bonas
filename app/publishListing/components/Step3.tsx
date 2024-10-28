import { ListingFormData } from "@/schemas/interfaces";
import { useState, useEffect, FormEvent } from "react";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { X } from "lucide-react";
import CloudinaryUpload from "./CloudinaryUpload/CloudinaryUpload";

interface Step3Props {
  onContinue: (data: {
    timeline: string;
    budget: string;
    listingImages: string[];
  }) => void;
  onBack: () => void;
  formData: ListingFormData;
}

export default function Step3({ onContinue, onBack, formData }: Step3Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [timeline, setTimeline] = useState<string>(formData.timeline || "");
  const [budget, setBudget] = useState<string>(formData.budget || "");
  const [listingImages, setListingImages] = useState<string[]>(
    formData.listingImages || []
  );

  // Handle Cloudinary upload success
  const handleUploadSuccess = (imageUrl: string) => {
    setListingImages((prev) => [...prev, imageUrl]);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isUploading) {
      return;
    }
    onContinue({ timeline, budget, listingImages });
  };

  useEffect(() => {
    setTimeline(formData.timeline || "");
    setBudget(formData.budget || "");
    setListingImages(formData.listingImages || []);
  }, [formData]);

  

  // Handle Cloudinary upload success
  // const handleUploadSuccess = (result: any) => {
  //   const imageUrl = result.info.secure_url;
  //   setListingImages((prev) => [...prev, imageUrl]);
  // };

  // Handle image removal
  const handleRemoveImage = (indexToRemove: number) => {
    setListingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="flex flex-col md:flex-row">
      {/* Left Column */}
      <div className="w-full md:w-1/3 pr-0 md:pr-8 mb-6 md:mb-0">
        <h1 className="text-4xl md:text-6xl font-bold mb-2 text-black">
          Timeline & Budget
        </h1>
        <p className="text-lg mb-2 text-gray-700">
          Let&apos;s set your project expectations.
        </p>
        <a href="#" className="text-sm text-blue-600 hover:underline">
          How does the matching thing work?
        </a>
        <div className="mt-8 hidden md:block">
          {/* person SVG */}
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
            {/* Timeline Field */}
            <div>
              <label
                htmlFor="timeline"
                className="block font-bold mb-2 text-black text-lg"
              >
                Project Timeline
              </label>
              <p className="text-sm text-gray-600 mb-2">
                How long do you expect your project to take?
              </p>
              <select
                id="timeline"
                className="w-full border rounded-md p-2 text-black bg-gray-200"
                required
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
              >
                <option value="">Select a timeline</option>
                <option value="Less than 1 month">Less than 1 month</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="More than 6 months">More than 6 months</option>
              </select>
            </div>

            {/* Budget Field */}
            <div>
              <label
                htmlFor="budget"
                className="block font-bold mb-2 text-black text-lg"
              >
                Project Budget
              </label>
              <p className="text-sm text-gray-600 mb-2">
                What&apos;s your estimated budget for this project?
              </p>
              <div className="relative mt-1 rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">XAF</span>
                </div>
                <input
                  type="text"
                  name="budget"
                  id="budget"
                  className="block w-full rounded-md border-0 py-1.5 pl-12 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="0"
                  aria-describedby="price-currency"
                  value={budget}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) || value === "") {
                      setBudget(value);
                    }
                  }}
                  required
                />
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                  <span
                    className="text-gray-500 sm:text-sm"
                    id="price-currency"
                  >
                    XAF
                  </span>
                </div>
              </div>
            </div>

            {/* Listing Images Field */}
            <div>
              <label className="block font-bold mb-2 text-black text-lg">
                Listing Images
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Upload up to 5 images for your listing (minimum 1 required)
              </p>

              {/* Upload Button */}
              {/* {listingImages.length < 5 && (
                <CldUploadWidget
                  uploadPreset="lymdepzy"
                  options={{
                    sources: ["local"],
                    multiple: true,
                  }}
                  onSuccess={handleUploadSuccess}
                >
                  {({ open }) => (
                    <button
                      onClick={() => open()}
                      className="cursor-pointer inline-block bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors mb-4"
                    >
                      Add Image ({listingImages.length}/5)
                    </button>
                  )}
                </CldUploadWidget>
              )} */}
              <CloudinaryUpload
                onUploadSuccess={handleUploadSuccess}
                onUploadError={(error) =>
                  console.error("Upload failed:", error)
                }
                currentFiles={listingImages}
                maxFiles={5}
                multiple={true}
              />

              {/* Images Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {listingImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="relative w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Listing image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              {listingImages.length === 0 && (
                <p className="text-red-500 text-sm mt-2">
                  Please upload at least one image for your listing
                </p>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
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
              disabled={listingImages.length === 0}
            >
              Continue →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
