// schemas/Step3Schema.ts
import { z } from "zod";

export const Step3Schema = z.object({
  deadline: z.date({
    required_error: "A deadline date is required",
  }),
  price: z
    .number()
    .min(1, "Price must be greater than 0")
    .max(1000000000, "Price cannot exceed 1,000,000,000"),
  tags: z.array(z.string()).optional(),
  negotiable: z.boolean().optional().default(false),
  delivery_available: z.boolean().optional().default(false),
});

export type Step3Data = z.infer<typeof Step3Schema>;

export const AVAILABLE_TAGS = [
  "New",
  "Refurbished",
  "Pre-Owned",
  "Excellent Quality",
  "Urgent Sale",
  "Limited Time Offer",
  "Negotiable Price",
  "Cash Only",
  "Local Pickup",
  "Nationwide Delivery",
  "Fast Shipping",
  "Free Delivery",
  "Exclusive",
  "Safety & Guarantee",
  "Warranty Included",
  "Limited Stock",
  "Special Offer",
] as const;
