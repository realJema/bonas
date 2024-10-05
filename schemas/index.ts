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