"use server";

import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().nonnegative("Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity can not be negative"),
  lowStockAt: z.coerce
    .number()
    .int()
    .min(0, "Low Stock value can not be negative")
    .optional(),
});
