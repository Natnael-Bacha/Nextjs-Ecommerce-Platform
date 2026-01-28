"use client";

import { useState, useTransition } from "react";
import { removeCartItem } from "@/lib/actions/cart";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface RemoveCartItemButtonProps {
  cartItemId: string;
  cartId: string;
  onRemove: (cartItemId: string) => void; // new callback
}

export default function RemoveCartItemButton({
  cartItemId,
  cartId,
  onRemove,
}: RemoveCartItemButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const handleRemove = () => {
    startTransition(async () => {
      // Optimistically remove from state
      onRemove(cartItemId);

      // Call backend
      await removeCartItem(cartItemId, cartId);
      router.refresh();
      setSuccess(true);
    });
  };

  if (success) {
    return (
      <span className="text-sm font-medium text-green-600">Removed ✓</span>
    );
  }

  return (
    <button
      onClick={handleRemove}
      disabled={isPending}
      className="text-gray-300 hover:text-red-500 transition-colors p-1 disabled:opacity-50"
    >
      {isPending ? "Removing..." : <X />}
    </button>
  );
}
