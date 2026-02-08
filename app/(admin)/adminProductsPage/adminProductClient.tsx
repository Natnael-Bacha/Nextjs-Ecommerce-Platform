"use client";

import Link from "next/link";
import { Pencil, Search, X } from "lucide-react";
import Image from "next/image";
import DeleteProductButton from "../../../components/delete-product-button";
import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface productPageProps {
  products: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    quantity: number;
    lowStockAt?: number | null;
    description?: string | null;
  }[];
}

export default function AdminProductClientPage({ products }: productPageProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // Local state to control the input text
  const [query, setQuery] = useState(
    searchParams.get("query")?.toString() || "",
  );

  // Update the URL based on search term (debounced)
  const updateUrl = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Handles typing
  const handleSearch = (term: string) => {
    setQuery(term);
    updateUrl(term);
  };

  // Handles clearing the search
  const handleClear = () => {
    setQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-8">
        {/* Search Bar Section */}
        <div className="w-full max-w-md">
          <div className="relative w-full group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-zinc-900 transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition shadow-sm"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition"
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">
            {query ? `Results for "${query}"` : "All Products"}
          </h1>
          <span className="text-sm text-zinc-500">{products.length} items</span>
        </div>

        {/* Product Grid */}
        {products.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-zinc-200 py-20 text-center">
            <div className="rounded-full bg-zinc-100 p-4 mb-4">
              <Search size={32} className="text-zinc-400" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900">
              No products found
            </h3>
            <p className="text-zinc-500 mt-1">
              Try adjusting your search or filters.
            </p>
            <button
              onClick={handleClear}
              className="mt-4 text-sm font-semibold text-zinc-900 hover:underline"
            >
              Clear all searches
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({
  product,
}: {
  product: {
    id: string;
    name: string;
    price: number;
    image?: string | null;
    quantity: number;
    lowStockAt?: number | null;
    description?: string | null;
  };
}) {
  const [expanded, setExpanded] = useState(false);
  const maxLength = 80;

  const shortDescription =
    product.description && product.description.length > maxLength
      ? product.description.slice(0, maxLength) + "..."
      : product.description;

  const shouldShowToggle =
    product.description && product.description.length > maxLength;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md">
      <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="object-cover transition-transform duration-300 group-hover:scale-105 w-full h-full absolute inset-0"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-400 text-xs">
            No Image
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h2 className="line-clamp-1 text-lg font-semibold text-zinc-900">
          {product.name}
        </h2>

        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-zinc-900 text-base">
            ${Number(product.price).toFixed(2)}
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              product.quantity <= (product.lowStockAt ?? 0)
                ? "bg-red-50 text-red-600"
                : "bg-emerald-50 text-emerald-600"
            }`}
          >
            {product.quantity} in stock
          </span>
        </div>

        {product.description && (
          <div className="mt-1 text-sm text-zinc-600 leading-relaxed">
            <p className="inline">
              {expanded ? product.description : shortDescription}
            </p>
            {shouldShowToggle && (
              <button
                type="button"
                onClick={() => setExpanded(!expanded)}
                className="ml-1 font-semibold text-zinc-900 hover:text-zinc-600 underline decoration-zinc-300"
              >
                {expanded ? "less" : "more"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Admin Actions */}
      <div className="absolute right-3 top-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/updateProduct?id=${product.id}`}
          className="rounded-full bg-white p-2 text-zinc-700 shadow-lg transition hover:bg-zinc-100"
        >
          <Pencil size={14} />
        </Link>
        <DeleteProductButton productId={product.id} />
      </div>
    </div>
  );
}
