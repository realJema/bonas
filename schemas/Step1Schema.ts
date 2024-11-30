import { z } from "zod";

export const Step1Schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(30, "Description must be at least 30 characters")
    .max(1500, "Description cannot exceed 1500 characters"),
  cover_image: z.string().min(1, "Cover image is required"),
  listingImages: z
    .array(z.string())
    .max(5, "Maximum 5 additional images allowed")
    .optional(),
});

export type Step1Data = z.infer<typeof Step1Schema>;
