import { ListingFormData } from "@/schemas/interfaces";
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";

interface Step3Props {
  onContinue: (data: {
    timeline?: string;
    price: number;
    listingImages: string[];
    listingId: string;
  }) => void;
  onBack: () => void;
  formData: ListingFormData;
}

const TIMELINE_OPTIONS = [
  { value: "Less than 1 month", label: "Less than 1 month" },
  { value: "1-3 months", label: "1-3 months" },
  { value: "3-6 months", label: "3-6 months" },
  { value: "More than 6 months", label: "More than 6 months" },
];

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGES = 5;

export default function Step3({ onContinue, onBack, formData }: Step3Props) {
  const [timeline, setTimeline] = useState<string>(formData.timeline || "");
  const [price, setPrice] = useState<string>(formData.price?.toString() || "");
  const [listingImages, setListingImages] = useState<string[]>(
    formData.listingImages || []
  );
  const [priceError, setPriceError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTimeline(formData.timeline || "");
    // Format initial price with commas if exists
    const initialPrice = formData.price?.toLocaleString() || "";
    setPrice(initialPrice);
    setListingImages(formData.listingImages || []);
  }, [formData]);

  const handlePriceChange = (value: string) => {
    setPriceError("");
    // Remove existing commas and non-digit characters except decimal
    const sanitizedValue = value.replace(/,/g, "").replace(/[^\d.]/g, "");

    // Ensure only one decimal point
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) return;

    // Limit decimal places to 2
    if (parts[1] && parts[1].length > 2) return;

    // Validate maximum value
    if (Number(sanitizedValue) > 1000000000) {
      setPriceError("Maximum price is 1,000,000,000 XAF");
      return;
    }

    // Format with commas for thousands
    const formattedValue = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const finalValue =
      parts.length === 2 ? `${formattedValue}.${parts[1]}` : formattedValue;

    setPrice(finalValue);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const totalImages = files.length + listingImages.length;

    if (totalImages > MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`);
      return;
    }

    files.forEach((file) => {
      if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
        toast.error("Please upload only JPG or PNG images");
        return;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Each image must be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setListingImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setListingImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If listing already exists, just move to final step
    if (formData.listingId) {
      onContinue({
        timeline: timeline || undefined,
        price: Number(price.replace(/,/g, "")),
        listingImages,
        listingId: formData.listingId,
      });
      return;
    }

    // Only proceed with saving if it's a new listing
    setIsSubmitting(true);

    try {
      const numericPrice = Number(price.replace(/,/g, ""));
      if (isNaN(numericPrice) || numericPrice <= 0) {
        setPriceError("Please enter a valid price");
        return;
      }

      if (listingImages.length === 0) {
        toast.error("Please upload at least one image");
        return;
      }

      const response = await axios.post("/api/postListing", {
        ...formData,
        timeline,
        price: numericPrice,
        listingImages,
        status: "inactive",
      });

      if (response.data?.id) {
        toast.success("Listing saved successfully!");
        onContinue({
          timeline: timeline || undefined,
          price: numericPrice,
          listingImages,
          listingId: response.data.id,
        });
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || "Failed to save listing";
      toast.error(errorMessage);
      console.error("Error saving listing:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
      {/* Left Column */}
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Details & Images
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Set your price and add images to make your listing stand out.
        </p>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price & Timeline Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Pricing & Timeline</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Budget)
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">XAF</span>
                  </div>
                  <input
                    type="text"
                    className={`block w-full rounded-md py-1.5 pl-12 pr-12 text-gray-900
                      border border-gray-300 focus:ring-0
                      placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    required
                  />
                </div>
                {priceError && (
                  <p className="mt-1 text-sm text-red-600">{priceError}</p>
                )}
              </div>

              {/* Timeline Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Timeline (Optional)
                </label>
                <select
                  className="w-full rounded-md py-1.5 text-gray-900 border border-gray-300 
                    focus:ring-0"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                >
                  <option value="">Select a timeline</option>
                  {TIMELINE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Listing Images</h2>

            {listingImages.length < MAX_IMAGES && (
              <div
                className="relative mb-4 block w-full cursor-pointer appearance-none rounded-lg 
                border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:border-gray-400 transition-colors"
              >
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isSubmitting}
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="rounded-full bg-gray-100 p-2">
                    <svg
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <span className="text-sm font-medium text-black">
                      Upload images
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG up to 10MB ({listingImages.length}/{MAX_IMAGES}{" "}
                      images)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Images Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full 
                      opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    disabled={isSubmitting}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-400 rounded-md text-gray-700 
                hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              ← Back
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                isSubmitting ||
                listingImages.length === 0 ||
                !price ||
                !!priceError
              }
            >
              {isSubmitting ? "Saving..." : "Continue →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// import { ListingFormData } from "@/schemas/interfaces";
// import { useState, useEffect, FormEvent } from "react";
// import Image from "next/image";
// import { X } from "lucide-react";
// import { toast } from "react-toastify";
// import axios from "axios";

// interface Step3Props {
//   onContinue: (data: {
//     timeline?: string;
//     price: number;
//     listingImages: string[];
//     listingId: string;
//   }) => void;
//   onBack: () => void;
//   formData: ListingFormData;
// }

// const TIMELINE_OPTIONS = [
//   { value: "Less than 1 month", label: "Less than 1 month" },
//   { value: "1-3 months", label: "1-3 months" },
//   { value: "3-6 months", label: "3-6 months" },
//   { value: "More than 6 months", label: "More than 6 months" },
// ];

// const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
// const MAX_IMAGES = 5;

// export default function Step3({ onContinue, onBack, formData }: Step3Props) {
//   const [timeline, setTimeline] = useState<string>(formData.timeline || "");
//   const [price, setPrice] = useState<string>(formData.price?.toString() || "");
//   const [listingImages, setListingImages] = useState<string[]>(
//     formData.listingImages || []
//   );
//   const [priceError, setPriceError] = useState<string>("");
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     setTimeline(formData.timeline || "");
//     setPrice(formData.price?.toString() || "");
//     setListingImages(formData.listingImages || []);
//   }, [formData]);

//   const handlePriceChange = (value: string) => {
//     setPriceError("");
//     const sanitizedValue = value.replace(/[^\d.]/g, "");

//     const parts = sanitizedValue.split(".");
//     if (parts.length > 2) return;

//     if (parts[1] && parts[1].length > 2) return;

//     if (Number(sanitizedValue) > 1000000000) {
//       setPriceError("Maximum price is 1,000,000,000 XAF");
//       return;
//     }

//     setPrice(sanitizedValue);
//   };

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);
//     const totalImages = files.length + listingImages.length;

//     if (totalImages > MAX_IMAGES) {
//       toast.error(`Maximum ${MAX_IMAGES} images allowed`);
//       return;
//     }

//     files.forEach((file) => {
//       if (!file.type.match(/^image\/(jpeg|png|jpg)$/)) {
//         toast.error("Please upload only JPG or PNG images");
//         return;
//       }

//       if (file.size > MAX_IMAGE_SIZE) {
//         toast.error("Each image must be less than 10MB");
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result as string;
//         setListingImages((prev) => [...prev, result]);
//       };
//       reader.readAsDataURL(file);
//     });
//   };

//   const handleRemoveImage = (indexToRemove: number) => {
//     setListingImages((prev) =>
//       prev.filter((_, index) => index !== indexToRemove)
//     );
//   };

// const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//   e.preventDefault();

//   // If listing already exists, just move to final step
//   if (formData.listingId) {
//     onContinue({
//       timeline: timeline || undefined,
//       price: Number(price),
//       listingImages,
//       listingId: formData.listingId,
//     });
//     return;
//   }

//   // Only proceed with saving if it's a new listing
//   setIsSubmitting(true);

//   try {
//     const numericPrice = Number(price);
//     if (isNaN(numericPrice) || numericPrice <= 0) {
//       setPriceError("Please enter a valid price");
//       return;
//     }

//     if (listingImages.length === 0) {
//       toast.error("Please upload at least one image");
//       return;
//     }

//     const response = await axios.post("/api/postListing", {
//       ...formData,
//       timeline,
//       price: numericPrice,
//       listingImages,
//       status: "inactive",
//     });

//     if (response.data?.id) {
//       toast.success("Listing saved successfully!");
//       onContinue({
//         timeline: timeline || undefined,
//         price: numericPrice,
//         listingImages,
//         listingId: response.data.id,
//       });
//     }
//   } catch (error: any) {
//     const errorMessage =
//       error.response?.data?.error || "Failed to save listing";
//     toast.error(errorMessage);
//     console.error("Error saving listing:", error);
//   } finally {
//     setIsSubmitting(false);
//   }
// };

//   return (
//     <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
//       {/* Left Column */}
//       <div className="w-full md:w-1/3">
//         <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
//           Details & Images
//         </h1>
//         <p className="text-lg mb-4 text-gray-700">
//           Set your price and add images to make your listing stand out.
//         </p>
//       </div>

//       {/* Right Column */}
//       <div className="w-full md:w-2/3">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Price & Timeline Section */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <h2 className="text-xl font-semibold mb-4">Pricing & Timeline</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Price Input */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Price (Budget)
//                 </label>
//                 <div className="relative mt-1 rounded-md shadow-sm">
//                   <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
//                     <span className="text-gray-500 sm:text-sm">XAF</span>
//                   </div>
//                   <input
//                     type="text"
//                     className={`block w-full rounded-md py-1.5 pl-12 pr-12 text-gray-900
//                       border border-gray-300 focus:ring-0
//                       placeholder:text-gray-400 sm:text-sm sm:leading-6`}
//                     placeholder="0.00"
//                     value={price}
//                     onChange={(e) => handlePriceChange(e.target.value)}
//                     required
//                   />
//                 </div>
//                 {priceError && (
//                   <p className="mt-1 text-sm text-red-600">{priceError}</p>
//                 )}
//               </div>

//               {/* Timeline Select */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Timeline (Optional)
//                 </label>
//                 <select
//                   className="w-full rounded-md py-1.5 text-gray-900 border border-gray-300
//                     focus:ring-0"
//                   value={timeline}
//                   onChange={(e) => setTimeline(e.target.value)}
//                 >
//                   <option value="">Select a timeline</option>
//                   {TIMELINE_OPTIONS.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Images Section */}
//           <div className="bg-white p-6 rounded-lg shadow-sm border">
//             <h2 className="text-xl font-semibold mb-4">Listing Images</h2>

//             {listingImages.length < MAX_IMAGES && (
//               <div
//                 className="relative mb-4 block w-full cursor-pointer appearance-none rounded-lg
//                 border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:border-gray-400 transition-colors"
//               >
//                 <input
//                   type="file"
//                   accept="image/jpeg,image/png,image/jpg"
//                   multiple
//                   onChange={handleImageUpload}
//                   className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
//                   disabled={isSubmitting}
//                 />
//                 <div className="flex flex-col items-center justify-center gap-2">
//                   <div className="rounded-full bg-gray-100 p-2">
//                     <svg
//                       className="h-6 w-6 text-gray-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 4v16m8-8H4"
//                       />
//                     </svg>
//                   </div>
//                   <div className="text-center">
//                     <span className="text-sm font-medium text-black">
//                       Upload images
//                     </span>
//                     <p className="text-xs text-gray-500 mt-1">
//                       PNG, JPG up to 10MB ({listingImages.length}/{MAX_IMAGES}{" "}
//                       images)
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Images Preview */}
//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//               {listingImages.map((image, index) => (
//                 <div
//                   key={index}
//                   className="relative aspect-square w-full group"
//                 >
//                   <Image
//                     src={image}
//                     alt={`Listing image ${index + 1}`}
//                     fill
//                     className="object-cover rounded-lg"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveImage(index)}
//                     className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full
//                       opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
//                     disabled={isSubmitting}
//                   >
//                     <X size={16} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Navigation */}
//           <div className="flex justify-between pt-4">
//             <button
//               type="button"
//               onClick={onBack}
//               className="px-6 py-2 border border-gray-400 rounded-md text-gray-700
//                 hover:bg-gray-50 transition-colors"
//               disabled={isSubmitting}
//             >
//               ← Back
//             </button>
//             <button
//               type="submit"
//               className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800
//                 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//               disabled={
//                 isSubmitting ||
//                 listingImages.length === 0 ||
//                 !price ||
//                 !!priceError
//               }
//             >
//               {isSubmitting ? "Saving..." : "Continue →"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
