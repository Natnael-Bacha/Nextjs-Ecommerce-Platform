"use client";

import { Trash2 } from "lucide-react";
import { deleteProduct } from "@/lib/actions/product";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteProductButton({
  productId,
}: {
  productId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      onClick={() => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this product? This action cannot be undone.",
        );

        if (!confirmed) return;

        startTransition(async () => {
          await deleteProduct(productId);
          router.refresh();
        });
      }}
      disabled={isPending}
      className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm backdrop-blur transition hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={16} />
    </button>
  );
}
