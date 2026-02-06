"use client";

import Image from "next/image";
import AddToCartButton from "@/components/addToCart";
import BuyProductModal from "@/components/BuyProductModal";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  price: number;
  image?: string | null;
  quantity: number;
  lowStockAt?: number | null;
  description?: string | null;
}

interface productPageProps {
  products: Product[];
}

export default function UserProductClientPage({ products }: productPageProps) {
  return (
    <div className="p-6 bg-zinc-50 min-h-screen">
      {/* Dynamic Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"></div>

      {/* Product Grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex text-center align-middle items-center justify-center w-full h-full text-zinc-500 py-20">
          No Results
        </div>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 100; // You can adjust this limit

  const hasDescription = !!product.description;
  const isLongDescription = (product.description?.length ?? 0) > maxLength;

  const displayDescription =
    isLongDescription && !expanded
      ? product.description?.slice(0, maxLength) + "..."
      : product.description;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-56 w-full overflow-hidden bg-zinc-100">
        {product.image && (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <h2 className="font-semibold text-zinc-900 text-lg">
            {product.name}
          </h2>
          <span className="text-lg font-bold text-zinc-900">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <p className="mb-2 text-sm text-zinc-500">
          {product.quantity > 0 ? (
            `${product.quantity} in stock`
          ) : (
            <span className="text-red-500">Out of stock</span>
          )}
        </p>

        {/* Description Section */}
        {hasDescription && (
          <div className="mb-6 text-sm text-zinc-600 leading-relaxed">
            <p className="inline">{displayDescription}</p>
            {isLongDescription && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="ml-1 font-semibold text-zinc-900 hover:underline decoration-zinc-300 transition-colors"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </div>
        )}

        <div className="mt-auto flex gap-2">
          <AddToCartButton productId={product.id} />
          <BuyProductModal
            productId={product.id}
            maxQuantity={product.quantity}
          />
        </div>
      </div>
    </div>
  );
}
