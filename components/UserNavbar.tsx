"use client";

import { useState } from "react";
import { ShoppingCart, Search, X } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  userName?: string;
  cartCount?: number;
}

export default function UserNavbar({ userName, cartCount = 0 }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const isProductPage = pathname === "/userProducts";

  const [searchOpen, setSearchOpen] = useState(false);

  const currentQuery = searchParams.get("query") || "";

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleClear = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="text-xl font-bold text-gray-900 shrink-0">
        <Link href="/">ESSENTIALS.</Link>
      </div>

      <div className="flex-1 mx-4 relative max-w-md">
        {isProductPage && searchOpen && (
          <div
            className="relative animate-in fade-in slide-in-from-right-2 duration-200"
            key={currentQuery}
          >
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              autoFocus
              defaultValue={currentQuery}
              placeholder="Search products..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border rounded-full pl-10 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all"
            />
            {currentQuery && (
              <button
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                <X size={16} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {isProductPage && (
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`p-2 rounded-full transition-colors ${
              searchOpen
                ? "bg-black text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
        )}

        <Link
          href="/cart"
          className="relative p-2 rounded hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </Link>

        <div className="hidden md:flex items-center gap-3 ml-2 border-l pl-4 border-gray-200">
          <div className="text-sm text-gray-700 font-medium">{userName}</div>
          <LogoutButton />
        </div>

        <div className="md:hidden">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
