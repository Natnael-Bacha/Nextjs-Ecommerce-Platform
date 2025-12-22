import { z } from "zod";

const nameRegex = /^[a-zA-Z\s'-]+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;

const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

export const signUpSchema = z
  .object({
    email: z.email("Invalid email address"),

    password: passwordSchema,

    confirmPassword: z.string().min(1, "Please confirm your password"),

    firstName: z
      .string()
      .min(2, "First name is required")
      .regex(nameRegex, "No numbers or emojis"),

    middleName: z
      .string()
      .min(1, "Middle name is required")
      .regex(nameRegex, "No numbers or emojis"),

    lastName: z
      .string()
      .min(2, "Last name is required")
      .regex(nameRegex, "No numbers or emojis"),

    phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;
