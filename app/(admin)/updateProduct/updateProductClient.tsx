"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProductClientSchema } from "@/lib/actions/validations";
import { updateProduct } from "@/lib/actions/product";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    lowStockAt: number | null;
    image?: string;
  };
}

export default function UpdateProductForm({ product }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  type UpdateProductClientInput = z.input<typeof UpdateProductClientSchema>;
  type UpdatedProductOutput = z.infer<typeof UpdateProductClientSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProductClientInput>({
    resolver: zodResolver(UpdateProductClientSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      lowStockAt: product.lowStockAt ?? undefined,
    },
  });

  function onSubmit(values: UpdateProductClientInput) {
    const parsed: UpdatedProductOutput =
      UpdateProductClientSchema.parse(values);
    const formData = new FormData();

    formData.append("id", product.id);

    if (parsed.name !== undefined) formData.append("name", parsed.name);
    if (parsed.price !== undefined)
      formData.append("price", String(parsed.price));
    if (parsed.quantity !== undefined)
      formData.append("quantity", String(parsed.quantity));
    if (parsed.lowStockAt !== undefined)
      formData.append("lowStockAt", String(parsed.lowStockAt));

    const fileInput = document.querySelector(
      'input[name="image"]',
    ) as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]);
    }

    startTransition(async () => {
      const result = await updateProduct(formData);
      if (result.success) {
        toast.success("Product updated successfully!");
        router.push("/adminProductsPage");
      } else {
        toast.error("Update failed: " + result.error);
      }
    });
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto p-4"
    >
      {/* Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Product Name
        </label>
        <input
          {...register("name")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter product name"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Price</label>
        <input
          type="number"
          step="0.01"
          {...register("price")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter product price"
        />
        {errors.price && (
          <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      {/* Quantity */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">Quantity</label>
        <input
          type="number"
          {...register("quantity")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter available quantity"
        />
        {errors.quantity && (
          <p className="text-red-500 text-sm mt-1">{errors.quantity.message}</p>
        )}
      </div>

      {/* Low stock threshold */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Low Stock Threshold
        </label>
        <input
          type="number"
          {...register("lowStockAt")}
          className="w-full border px-3 py-2 rounded"
          placeholder="Enter low stock alert threshold"
        />
        {errors.lowStockAt && (
          <p className="text-red-500 text-sm mt-1">
            {errors.lowStockAt.message}
          </p>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Product Image
        </label>
        <input type="file" name="image" accept="image/*" className="w-full" />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isPending}
        className={`w-full bg-black text-white px-4 py-2 rounded ${
          isPending ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
        }`}
      >
        {isPending ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
