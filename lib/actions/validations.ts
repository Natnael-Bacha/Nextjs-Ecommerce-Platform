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
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity can not be negative"),
  lowStockAt: z.coerce
    .number()
    .int()
    .min(0, "Low Stock value can not be negative")
    .optional(),

  image: z
    .any()
    .refine((file) => file instanceof File, "Image is required.")
    .refine((file) => file?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),
});

export const UpdateProductSchema = z.object({
  id: z.string().min(1, "Product ID is required"),

  name: z
    .string()
    .min(1, "Name is required")
    .refine(
      (val) => !/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u.test(val),
      "Product name cannot contain emojis"
    )
    .optional(),

  price: z.coerce.number().nonnegative().optional(),
  quantity: z.coerce.number().int().min(0).optional(),
  lowStockAt: z.coerce.number().int().min(0).optional(),

  image: z
    .any()
    .optional()
    .refine((file) => !file || file instanceof File, "Invalid image")
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      "Max file size is 5MB"
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Invalid image type"
    ),
});

export const UpdateProductClientSchema = UpdateProductSchema.omit({
  id: true,
});
