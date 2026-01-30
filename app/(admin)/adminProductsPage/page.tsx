import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";
import Link from "next/link";
import { Pencil, Search } from "lucide-react";
import Image from "next/image";
import DeleteProductButton from "../../../components/delete-product-button";

export default async function AdminProductPage() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user || user.role !== "admin") unauthorized();

  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      quantity: true,
      lowStockAt: true,
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col gap-8">
        <div className="w-full max-w-md">
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search everything..."
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-2 pl-10 pr-4 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-900">Products</h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <div className="relative h-48 w-full bg-zinc-100">
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <div className="space-y-2 p-4">
                <h2 className="line-clamp-1 text-lg font-semibold text-zinc-900">
                  {product.name}
                </h2>

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-900">
                    ${Number(product.price)}
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      product.quantity <= (product.lowStockAt ?? 0)
                        ? "bg-red-100 text-red-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {product.quantity} in stock
                  </span>
                </div>

                <div className="text-xs text-zinc-500">
                  Low stock at: {product.lowStockAt ?? "-"}
                </div>
              </div>

              <div className="absolute right-3 top-3 flex gap-2">
                <Link
                  href={`/updateProduct?id=${product.id}`}
                  className="rounded-full bg-white/90 p-2 text-zinc-700 shadow-sm backdrop-blur transition hover:bg-zinc-100"
                >
                  <Pencil size={16} />
                </Link>

                <DeleteProductButton productId={product.id} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
