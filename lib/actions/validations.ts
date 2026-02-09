import { z } from "zod";
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
export const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative").min(1),
  quantity: z.coerce.number().int().min(0, "Quantity can not be negative"),
  lowStockAt: z.coerce
    .number()
    .int()
    .min(0, "Low Stock value can not be negative")
    .optional(),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image is required"),
});

export const UpdateProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),

  name: z
    .string()
    .min(1, "Name is required")
    .refine(
      (val) => !/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(val),
      "Product name cannot contain emojis",
    )
    .optional(),

  price: z.coerce.number().nonnegative().min(1).optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),
  description: z.string().min(1, "Description cannot be empty").optional(),
  image: z.string().optional(),
});

export const UpdateProductClientSchema = UpdateProductSchema.omit({
  id: true,
});
