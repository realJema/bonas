import { ListingFormData } from "@/schemas/interfaces";
import { useState } from "react";
import Image from "next/image";

interface FinalStepProps {
  formData: ListingFormData;
  onBack: () => void;
  onPublish: () => void;
}

export default function FinalStep({
  formData,
  onBack,
  onPublish,
}: FinalStepProps) {
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] =
    useState<boolean>(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await onPublish();
    } catch (error) {
      console.error("Error publishing listing:", error);
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
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Review & Publish
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Double-check your listing details before publishing.
        </p>
      </div>

      <div className="w-full md:w-2/3 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-2">Images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.profileImage && (
              <div className="relative w-32 h-32 rounded-full aspect-square col-span-2 row-span-2">
                <Image
                  src={formData.profileImage}
                  alt="Profile Image"
                  fill
                  className="object-cover rounded-full"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  Profile Image
                </div>
              </div>
            )}
            {formData.listingImages?.map((image, index) => (
              <div key={index} className="relative h-28 w-44 aspect-square">
                <Image
                  src={image}
                  alt={`Listing image ${index + 1}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1">{formData.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <div className="mt-1 prose prose-sm max-w-none">
                <p className="whitespace-pre-line">
                  {showFullDescription
                    ? formData.description
                    : formData.description.length > 300
                    ? `${formData.description.slice(0, 300)}...`
                    : formData.description}
                </p>
                {formData.description.length > 300 && (
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showFullDescription ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Location & Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Location</h3>
              <p className="mt-1">
                {formData.town}
                {formData.address && `, ${formData.address}`}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Category</h3>
              <p className="mt-1">
                {formData.categoryPath?.map((category, index) => (
                  <span key={category}>
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

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold mb-4">Price & Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Price</h3>
              <p className="mt-1 text-lg font-semibold">
                {formatPrice(formData.price)}
              </p>
            </div>
            {formData.timeline && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
                <p className="mt-1">{formData.timeline}</p>
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Additional Options
              </h3>
              <div className="mt-2 space-y-2">
                {formData.negotiable && (
                  <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-2">
                    Negotiable
                  </span>
                )}
                {formData.delivery_available && (
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                    Delivery Available
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-text"
          >
            {isPublishing ? "Publishing..." : "Publish Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

// import { ListingFormData } from "@/schemas/interfaces";
// import { useState } from "react";
// import Image from "next/image";

// interface FinalStepProps {
//   formData: ListingFormData;
//   onBack: () => void;
//   onPublish: () => void;
// }

// export default function FinalStep({
//   formData,
//   onBack,
//   onPublish,
// }: FinalStepProps) {
//   const [isPublishing, setIsPublishing] = useState<boolean>(false);
//   const [showFullDescription, setShowFullDescription] =
//     useState<boolean>(false);

//   const handlePublish = async () => {
//     setIsPublishing(true);
//     try {
//       await onPublish();
//     } catch (error) {
//       console.error("Error publishing listing:", error);
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const formatPrice = (price: number) => {
//     return new Intl.NumberFormat("fr-FR", {
//       style: "currency",
//       currency: "XAF",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 0,
//     }).format(price);
//   };

//   return (
//     <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
//       {/* Left Column */}
//       <div className="w-full md:w-1/3">
//         <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
//           Review & Publish
//         </h1>
//         <p className="text-lg mb-4 text-gray-700">
//           Double-check your listing details before publishing.
//         </p>
//       </div>

//       {/* Right Column (Summary) */}
//       <div className="w-full md:w-2/3 space-y-6">
//         {/* Images Section */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h2 className="text-xl font-semibold mb-2">Images</h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//             {formData.profileImage && (
//               <div className="relative w-32 h-32 rounded-full aspect-square col-span-2 row-span-2">
//                 <Image
//                   src={formData.profileImage}
//                   alt="Profile Image"
//                   fill
//                   className="object-cover rounded-full"
//                 />
//                 <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
//                   Profile Image
//                 </div>
//               </div>
//             )}
//             {formData.listingImages?.map((image, index) => (
//               <div key={index} className="relative h-28 w-44 aspect-square">
//                 <Image
//                   src={image}
//                   alt={`Listing image ${index + 1}`}
//                   fill
//                   className="object-cover rounded-lg"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Basic Information */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
//           <div className="space-y-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Title</h3>
//               <p className="mt-1">{formData.title}</p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Description</h3>
//               <div className="mt-1 prose prose-sm max-w-none">
//                 <p className="whitespace-pre-line">
//                   {showFullDescription
//                     ? formData.description
//                     : formData.description.length > 300
//                     ? `${formData.description.slice(0, 300)}...`
//                     : formData.description}
//                 </p>
//                 {formData.description.length > 300 && (
//                   <button
//                     type="button"
//                     onClick={() => setShowFullDescription(!showFullDescription)}
//                     className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                   >
//                     {showFullDescription ? "Show less" : "Show more"}
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Location & Category */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h2 className="text-xl font-semibold mb-4">Location & Category</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Location</h3>
//               <p className="mt-1">
//                 {formData.town}
//                 {formData.address && `, ${formData.address}`}
//               </p>
//             </div>
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Category ID</h3>
//               <p className="mt-1">{formData.subcategory_id}</p>
//             </div>
//           </div>
//         </div>

//         {/* Price & Details */}
//         <div className="bg-white p-6 rounded-lg shadow-sm border">
//           <h2 className="text-xl font-semibold mb-4">Price & Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">Price</h3>
//               <p className="mt-1 text-lg font-semibold">
//                 {formatPrice(formData.price)}
//               </p>
//             </div>
//             {formData.timeline && (
//               <div>
//                 <h3 className="text-sm font-medium text-gray-500">Timeline</h3>
//                 <p className="mt-1">{formData.timeline}</p>
//               </div>
//             )}
//             <div>
//               <h3 className="text-sm font-medium text-gray-500">
//                 Additional Options
//               </h3>
//               <div className="mt-2 space-y-2">
//                 {formData.negotiable && (
//                   <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 mr-2">
//                     Negotiable
//                   </span>
//                 )}
//                 {formData.delivery_available && (
//                   <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
//                     Delivery Available
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-between pt-4">
//           <button
//             type="button"
//             onClick={onBack}
//             className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
//           >
//             ← Back
//           </button>
//           <button
//             type="button"
//             onClick={handlePublish}
//             disabled={isPublishing}
//             className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-text"
//           >
//             {isPublishing ? "Publishing..." : "Publish Listing"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
