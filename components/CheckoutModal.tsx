"use client";

import { useState, useTransition } from "react";
import { checkout } from "@/lib/actions/cart";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
interface CheckoutModalProps {
  total: number;
  onEmpty: () => void;
}
export default function CheckoutModal({ total, onEmpty }: CheckoutModalProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCheckout = () => {
    setError(null);

    startTransition(async () => {
      try {
        onEmpty();
        await checkout();
        setSuccess(true);

        router.refresh();

        setTimeout(() => {
          setOpen(false);
          setSuccess(false);
        }, 1500);
      } catch (err: any) {
        setError(err.message || "Checkout failed");
      }
    });
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition"
      >
        Proceed to Checkout
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Confirm Checkout</h2>
              <button onClick={() => setOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {success ? (
              <div className="text-center py-8">
                <p className="text-green-600 font-semibold text-lg">
                  ✅ Order placed successfully!
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  You will be charged:
                </p>

                <p className="text-3xl font-bold mb-6">${total.toFixed(2)}</p>

                {error && (
                  <p className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  onClick={handleCheckout}
                  disabled={isPending}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold disabled:opacity-50"
                >
                  {isPending ? "Processing..." : "Confirm Order"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
