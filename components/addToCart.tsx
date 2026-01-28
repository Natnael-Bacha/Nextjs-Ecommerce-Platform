"use client";

import { addToCart } from "@/lib/actions/cart";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast, Toaster } from "sonner";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleAddToCart = () => {
    startTransition(async () => {
      try {
        await addToCart(productId);
        toast.success("Added to cart! 🛒");
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to add to cart");
      }
    });
  };

  return (
    <>
      {/* Button */}
      <button
        onClick={handleAddToCart}
        disabled={isPending}
        className={`
          flex items-center justify-center gap-2
          px-4 py-2 rounded-md
          bg-black text-white
          hover:bg-gray-800 transition
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        <ShoppingCart size={18} />
        {isPending ? "Adding..." : "Add to Cart"}
      </button>
    </>
  );
}
