"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Upload, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { createProduct } from "@/lib/actions/product";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const clientProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(0, "Price must be non-negative"),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  lowStockAt: z.coerce.number().int().min(0).optional(),
  description: z.string().min(1, "Description is required"),
  image: z
    .any()
    .refine((files) => files?.length === 1, "Image is required.")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`,
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted.",
    ),
});

type ProductFormInput = z.input<typeof clientProductSchema>;
type ProductFormData = z.infer<typeof clientProductSchema>;

export default function CreateProductClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProductFormInput>({
    resolver: zodResolver(clientProductSchema),
  });

  const imageFile = watch("image");
  React.useEffect(() => {
    if (imageFile && imageFile[0]) {
      const url = URL.createObjectURL(imageFile[0]);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const onSubmit = async (data: ProductFormInput) => {
    const parsed: ProductFormData = clientProductSchema.parse(data);

    setLoading(true);

    const formData = new FormData();
    formData.append("name", parsed.name);
    formData.append("price", parsed.price.toString());
    formData.append("quantity", parsed.quantity.toString());
    formData.append("lowStockAt", parsed.lowStockAt?.toString() || "0");
    formData.append("description", parsed.description); // ✅ Added description
    formData.append("image", parsed.image[0]);

    try {
      await createProduct(formData);
      router.push("/adminHomePage");
      toast.success("Product created successfully!");
    } catch {
      toast.error("Failed to create product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12">
      <div className="mx-auto max-w-3xl">
        {/* Back Button */}
        <Link
          href="/adminHomePage"
          className="mb-6 flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900">
              Create New Product
            </h1>
            <p className="text-sm text-zinc-500">
              Fill in the details to add a new product to your inventory.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-700">
                  Product Name
                </label>
                <input
                  {...register("name")}
                  placeholder="e.g. Wireless Headphones"
                  className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition"
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-700">
                  Product Description
                </label>
                <textarea
                  {...register("description")}
                  placeholder="Write a brief description of the product"
                  className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition resize-none"
                  rows={4}
                />
                {errors.description && (
                  <p className="text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Price ($)
                </label>
                <input
                  {...register("price")}
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition"
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Initial Quantity
                </label>
                <input
                  {...register("quantity")}
                  type="number"
                  placeholder="0"
                  className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition"
                />
                {errors.quantity && (
                  <p className="text-xs text-red-500">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Low Stock Alert */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-700">
                  Low Stock Alert Threshold
                </label>
                <input
                  {...register("lowStockAt")}
                  type="number"
                  placeholder="5"
                  className="w-full rounded-md border border-zinc-200 px-4 py-2.5 text-sm outline-none focus:border-zinc-900 focus:ring-4 focus:ring-zinc-100 transition"
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-zinc-700">
                  Product Image
                </label>
                <div className="relative">
                  {!preview ? (
                    <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:bg-zinc-100">
                      <Upload className="mb-2 text-zinc-400" size={24} />
                      <span className="text-xs font-medium text-zinc-500">
                        Click to upload or drag and drop
                      </span>
                      <span className="mt-1 text-[10px] text-zinc-400">
                        PNG, JPG or WEBP (Max 5MB)
                      </span>
                      <input
                        {...register("image")}
                        type="file"
                        className="hidden"
                        accept={ACCEPTED_IMAGE_TYPES.join(",")}
                      />
                    </label>
                  ) : (
                    <div className="relative h-48 w-full overflow-hidden rounded-xl border border-zinc-200">
                      <img
                        src={preview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setPreview(null)}
                        className="absolute right-2 top-2 rounded-full bg-white/80 p-1.5 text-zinc-900 backdrop-blur-sm hover:bg-white"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-xs text-red-500">
                    {errors.image?.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-zinc-900 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.99] disabled:opacity-70"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Creating Product..." : "Create Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
