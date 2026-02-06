"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateProductClientSchema } from "@/lib/actions/validations";
import { updateProduct } from "@/lib/actions/product";
import { useTransition, useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import Image from "next/image";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    lowStockAt: number | null;
    image: string;
    description: string;
  };
}

export default function UpdateProductForm({ product }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [preview, setPreview] = useState<string>(product.image);
  const [imageChanged, setImageChanged] = useState(false);

  type UpdateProductClientInput = z.input<typeof UpdateProductClientSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProductClientInput>({
    resolver: zodResolver(UpdateProductClientSchema),
    defaultValues: {
      name: product.name,
      price: product.price,
      quantity: product.quantity,
      lowStockAt: product.lowStockAt ?? undefined,
      description: product.description,
    },
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setImageChanged(true);
    }
  };

  async function onSubmit(values: UpdateProductClientInput) {
    const formData = new FormData();

    formData.append("id", product.id);
    formData.append("name", String(values.name));
    formData.append("price", String(values.price));
    formData.append("quantity", String(values.quantity));
    formData.append("description", values.description || "");

    if (values.lowStockAt !== undefined && values.lowStockAt !== null) {
      formData.append("lowStockAt", String(values.lowStockAt));
    }

    const fileInput = document.querySelector(
      'input[name="image"]',
    ) as HTMLInputElement;

    if (fileInput?.files?.[0]) {
      formData.append("image", fileInput.files[0]);
    }

    startTransition(async () => {
      try {
        const result = await updateProduct(formData);

        if (result.success) {
          toast.success("Product updated successfully!");
          router.push("/adminProductsPage");
          router.refresh();
        } else {
          toast.error("Update failed: " + result.error);
        }
      } catch {
        toast.error("An unexpected error occurred.");
      }
    });
  }

  const isButtonDisabled = isPending || (!isDirty && !imageChanged);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-xl mx-auto p-4"
    >
      <h2 className="text-2xl font-bold">Update Product</h2>

      {/* Image Preview & Upload */}
      <div className="space-y-4">
        <label className="block font-medium text-gray-700">Product Image</label>

        <div className="relative w-40 h-40 border rounded-lg overflow-hidden bg-gray-50">
          <Image src={preview} alt="Preview" fill className="object-cover" />
        </div>

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
        />
      </div>

      {/* Name */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Product Name
        </label>
        <input
          {...register("name")}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block mb-1 font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full border px-3 py-2 rounded"
          placeholder="Detailed product description..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Price, Quantity, Low Stock */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            {...register("price")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Quantity
          </label>
          <input
            type="number"
            {...register("quantity")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.quantity && (
            <p className="text-red-500 text-sm mt-1">
              {errors.quantity.message}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Low Stock At
          </label>
          <input
            type="number"
            {...register("lowStockAt")}
            className="w-full border px-3 py-2 rounded"
            placeholder="Alert at..."
          />
          {errors.lowStockAt && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lowStockAt.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isButtonDisabled}
        className={`w-full bg-black text-white px-4 py-2 rounded transition-opacity ${
          isButtonDisabled
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-800"
        }`}
      >
        {isPending ? "Updating..." : "Update Product"}
      </button>
    </form>
  );
}
