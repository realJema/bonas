import { ListingFormData } from "@/schemas/interfaces";
import { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface FinalStepProps {
  formData: ListingFormData;
  onBack: () => void;
  listingId?: string;
}

export default function FinalStep({
  formData,
  onBack,
  listingId,
}: FinalStepProps) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

  const handlePublish = async () => {
    if (!listingId) {
      toast.error("Invalid listing ID");
      return;
    }

    setIsPublishing(true);
    try {
      const response = await axios.patch(
        `/api/postListing/publish/${listingId}`
      );

      if (response.status === 200) {
        toast.success("Listing published successfully!");
        console.log("Published Listing:", response.data);
      }
    } catch (error: any) {
      console.error("Error publishing listing:", error);
      const errorMessage =
        error.response?.data?.details ||
        error.response?.data?.error ||
        "Failed to publish listing";
      toast.error(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "XAF",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
      {/* Left Column */}
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Review & Publish
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Double-check your listing details before publishing.
        </p>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">
            Publishing will:
          </h3>
          <ul className="mt-2 text-sm text-gray-700 space-y-2">
            <li>• Make your listing visible to all users</li>
            <li>• Allow potential buyers to contact you</li>
            <li>• Start tracking views and interactions</li>
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3 space-y-6">
        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {formData.profileImage && (
              <div className="relative w-full h-40 col-span-1">
                <Image
                  src={formData.profileImage}
                  alt="Profile Image"
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 640px) 100vw, 400px"
                  priority
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Profile Image
                </div>
              </div>
            )}
            {formData.listingImages?.map((image, index) => (
              <div key={index} className="relative w-full h-40">
                <Image
                  src={image}
                  alt={`Listing image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 640px) 100vw, 400px"
                  priority={index < 2}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1 text-lg">{formData.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <div className="mt-1 prose prose-sm max-w-none">
                <div
                  className="whitespace-pre-line"
                  dangerouslySetInnerHTML={{
                    __html: showFullDescription
                      ? formData.description
                      : formData.description.length > 300
                      ? `${formData.description.slice(0, 300)}...`
                      : formData.description,
                  }}
                />
                {formData.description.length > 300 && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-black hover:text-gray-700 text-sm font-medium mt-2"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Location & Category */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Location & Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1 text-lg">
                {formData.town}
                {formData.address && (
                  <span className="block text-sm text-gray-600 mt-1">
                    {formData.address}
                  </span>
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1">
                {formData.categoryPath?.map((category, index) => (
                  <span key={category} className="text-lg">
                    {category}
                    {index < (formData.categoryPath?.length || 0) - 1 && (
                      <span className="mx-2 text-gray-400">→</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>

        {/* Price & Details */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Price & Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-2xl font-bold text-black">
                {formatPrice(formData.price)}
              </p>
            </div>
            {formData.timeline && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                <p className="mt-1 text-lg">{formData.timeline}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-black rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isPublishing}
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {isPublishing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Listing"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
