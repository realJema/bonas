import { isValidCloudinaryUrl } from "@/utils/imageUtils";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters long" }),
});

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/\d/, "Password must contain at least one number"),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  username: z
    .string()
    .min(6, {
      message:
        "That’s too short. A great username must include at least 6 characters.",
    })
    .max(15, { message: "Username must be at most 15 characters long" })
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, {
      message:
        "Username must begin with a letter and can include numbers and underscores",
    }),
});

export const CreateListingSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(255, { message: "Title must be at most 255 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" }),
  category: z.string(),
  subcategory: z.string().optional(),
  subSubcategory: z.string().optional(),
  location: z.string(),
  timeline: z.string().optional(),
  budget: z.string().transform((val) => parseFloat(val)),
  profileImage: z
    .string()
    .optional()
    .refine(
      (val) => !val || val.startsWith("https://res.cloudinary.com/"),
      "Invalid image URL. Must be a Cloudinary URL"
    ),
  listingImages: z
    .array(z.string())
    .min(1, "At least one listing image is required")
    .max(5, "Maximum 5 images allowed")
    .refine(
      (urls) => urls.every(isValidCloudinaryUrl),
      "Invalid image URL. Must be Cloudinary URLs"
    ),
});

export type CreateListingInput = z.infer<typeof CreateListingSchema>;

export const UpdateListingSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long")
    .max(100, "Title must be at most 100 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  location: z.string().min(1, "Location is required"),
  timeline: z.string().min(1, "Timeline is required"),
  budget: z.union([
    z.number(),
    z.string().transform((val) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) throw new Error("Invalid budget number");
      return parsed;
    }),
  ]),
  category: z.string().min(1, "Category is required"),
  listingImages: z
    .array(z.string())
    .min(1, "At least one listing image is required")
    .max(5, "Maximum 5 images allowed")
    .refine(
      (urls) => urls.every(isValidCloudinaryUrl),
      "Invalid image URL. Must be Cloudinary URLs"
    ),
});

export type UpdateListingInput = z.infer<typeof UpdateListingSchema>;
