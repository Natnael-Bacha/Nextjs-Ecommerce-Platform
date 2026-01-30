"use client";

import { useState, useTransition } from "react";
import { buyProduct } from "../lib/actions/product";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BuyProductModal({
  productId,
  maxQuantity,
}: {
  productId: string;
  maxQuantity: number;
}) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleBuy = () => {
    setError(null);

    if (quantity < 1) {
      setError("Quantity must be at least 1");
      return;
    }

    if (quantity > maxQuantity) {
      setError(`Only ${maxQuantity} items available`);
      return;
    }

    startTransition(async () => {
      try {
        await buyProduct(productId, quantity);
        setSuccess(true);

        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
          setQuantity(1);
          router.refresh();
        }, 1200);
      } catch (e) {
        setError("Not enough stock available");
      }
    });
  };

  return (
    <>
      {/* BUY BUTTON */}
      <button
        onClick={() => {
          setOpen(true);
          setError(null);
          setSuccess(false);
        }}
        className="flex-1 rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-gray-800"
      >
        Buy Now
      </button>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Confirm Purchase</h3>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="rounded-md bg-emerald-50 p-4 text-center text-sm font-medium text-emerald-700">
                Purchase successful ✓
              </div>
            ) : (
              <>
                <label className="mb-2 block text-sm font-medium">
                  Quantity (max {maxQuantity})
                </label>

                <input
                  type="number"
                  min={1}
                  max={maxQuantity}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mb-2 w-full rounded-md border px-3 py-2"
                />

                {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

                <button
                  onClick={handleBuy}
                  disabled={isPending}
                  className="w-full rounded-md bg-black py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Confirm"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
