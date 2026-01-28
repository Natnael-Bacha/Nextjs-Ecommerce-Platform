"use client";

import { useState } from "react";
import { ShoppingCart, Search } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./logout";

interface Props {
  userName?: string;
  cartCount?: number;
}

export default function UserNavbar({ userName, cartCount = 0 }: Props) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between">
      <div className="text-xl font-bold text-gray-900">
        <Link href="/">ESSENTIALS.</Link>
      </div>

      <div className="flex-1 mx-4 relative">
        {searchOpen && (
          <input
            type="text"
            placeholder="Search products..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* Search Button */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <Search size={20} />
        </button>

        {/* Cart Button */}
        <Link
          href="/cart"
          className="relative p-2 rounded hover:bg-gray-100 transition-colors"
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>

        {/* User Name */}
        <div className="text-gray-700 font-medium">{userName}</div>

        <LogoutButton />
      </div>
    </nav>
  );
}
