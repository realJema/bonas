"use client";

import { ListingFormData } from "@/schemas/interfaces";
import { useState, useEffect } from "react";
import { Loader2, Tag, Truck, HandCoins } from "lucide-react";
import { toast } from "react-toastify";
import { Step3Schema, AVAILABLE_TAGS } from "@/schemas/Step3Schema";
import { addMonths } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DatePicker } from "./DatePicker";
import axios from "axios";

interface Step3Props {
  onContinue: (data: {
    deadline: Date;
    price: number;
    tags?: string[];
    negotiable?: boolean;
    delivery_available?: boolean;
    savingStatus: "pending" | "success" | "error";
    errorMessage?: string;
    listingId?: string;
  }) => void;
  onBack: () => void;
  formData: ListingFormData;
}

const currentYear = 2024; // Set current year to 2024

export default function Step3({ onContinue, onBack, formData }: Step3Props) {
  const [deadline, setDeadline] = useState<Date>(() => {
    if (formData.deadline) return new Date(formData.deadline);
    const defaultDate = addMonths(new Date(), 2);
    defaultDate.setFullYear(currentYear); // Ensure year is 2024
    return defaultDate;
  });
  const [price, setPrice] = useState<string>(formData.price?.toString() || "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    formData.tags || []
  );
  const [negotiable, setNegotiable] = useState<boolean>(
    formData.negotiable || false
  );
  const [deliveryAvailable, setDeliveryAvailable] = useState<boolean>(
    formData.delivery_available || false
  );
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDeadline(
      formData.deadline ? new Date(formData.deadline) : addMonths(new Date(), 2)
    );
    const initialPrice = formData.price?.toLocaleString() || "";
    setPrice(initialPrice);
    setSelectedTags(formData.tags || []);
    setNegotiable(formData.negotiable || false);
    setDeliveryAvailable(formData.delivery_available || false);
  }, [formData]);

  const handlePriceChange = (value: string) => {
    const sanitizedValue = value.replace(/,/g, "").replace(/[^\d.]/g, "");
    const parts = sanitizedValue.split(".");
    if (parts.length > 2) return;
    if (parts[1] && parts[1].length > 2) return;

    const formattedValue = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const finalValue =
      parts.length === 2 ? `${formattedValue}.${parts[1]}` : formattedValue;

    setPrice(finalValue);
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.price;
      return newErrors;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const validateForm = () => {
    try {
      const numericPrice = Number(price.replace(/,/g, ""));
      Step3Schema.parse({
        deadline,
        price: numericPrice,
        tags: selectedTags,
        negotiable,
        delivery_available: deliveryAvailable,
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      Object.values(errors).forEach((error) => {
        if (error) toast.error(error);
      });
      setIsSubmitting(false);
      return;
    }

    const numericPrice = Number(price.replace(/,/g, ""));

    // First, notify parent we're starting submission
    onContinue({
      deadline,
      price: numericPrice,
      tags: selectedTags,
      negotiable,
      delivery_available: deliveryAvailable,
      savingStatus: "pending",
    });

    try {
      // Format date to ISO string for API
      const formattedData = {
        ...formData,
        deadline: deadline.toISOString(), // Convert Date to ISO string
        price: numericPrice,
        tags: selectedTags,
        negotiable,
        delivery_available: deliveryAvailable,
        status: "inactive",
      };

      const response = await axios.post("/api/postListing", formattedData);

      if (response.data?.id) {
        onContinue({
          deadline,
          price: numericPrice,
          tags: selectedTags,
          negotiable,
          delivery_available: deliveryAvailable,
          savingStatus: "success",
          listingId: response.data.id,
        });
      }
    } catch (error: any) {
      console.error("Error submitting listing:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to save listing";

      onContinue({
        deadline,
        price: numericPrice,
        tags: selectedTags,
        negotiable,
        delivery_available: deliveryAvailable,
        savingStatus: "error",
        errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-4">
      {/* Left Column */}
      <div className="w-full md:w-1/3">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-black">
          Details & Budget
        </h1>
        <p className="text-lg mb-4 text-gray-700">
          Set your pricing strategy and enhance your listing with tags to
          attract more buyers.
        </p>
      </div>

      {/* Right Column */}
      <div className="w-full md:w-2/3">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Price & Deadline Section */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-4">Pricing & Deadline</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (Budget) <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">XAF</span>
                  </div>
                  <input
                    type="text"
                    className={`block w-full rounded-md py-1.5 pl-12 pr-12 text-gray-900
                      border ${
                        errors.price ? "border-red-500" : "border-gray-300"
                      } focus:ring-0
                      placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                    placeholder="0.00"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              {/* Deadline Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deadline <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={deadline}
                  onChange={(date) => {
                    if (date) {
                      const newDate = new Date(date);
                      newDate.setFullYear(currentYear);
                      setDeadline(newDate);
                    }
                  }}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>
            </div>

            {/* Pricing Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="negotiable"
                    checked={negotiable}
                    onCheckedChange={setNegotiable}
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
                    checked={deliveryAvailable}
                    onCheckedChange={setDeliveryAvailable}
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

          {/* Tags Section with enhanced UI */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Highlight Your Listing</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Select tags that best describe your listing to help buyers find
              exactly what they&apos;re looking for.
            </p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${
                      selectedTags.includes(tag)
                        ? "bg-black text-white shadow-md transform scale-105"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow"
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            {selectedTags.length > 0 && (
              <p className="text-sm text-gray-600 mt-4">
                {selectedTags.length} tags selected
              </p>
            )}
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
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