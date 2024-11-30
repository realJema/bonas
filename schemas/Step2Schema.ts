// schemas/Step2Schema.ts
import { z } from "zod";

export const Step2Schema = z.object({
  subcategory_id: z.number({
    required_error: "Please select a category",
  }),
  town: z.string().min(1, "Town is required"),
  address: z.string().min(1, "Address is required"),
  categoryPath: z.array(z.string()).min(1, "Category path is required"),
});

export type Step2Data = z.infer<typeof Step2Schema>;