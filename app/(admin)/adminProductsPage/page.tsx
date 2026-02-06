// adminProductServer.tsx
import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";
import AdminProductClientPage from "./adminProductClient";
import { searchProduct } from "@/lib/actions/product";

// 1. Define the props to accept searchParams
export default async function AdminProductServerPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await getServerSession();
  const user = session?.user;
  if (!user || user.role !== "admin") unauthorized();

  // Await the searchParams
  const { query } = await searchParams;

  // 2. Fetch products based on the query
  const products = await searchProduct(query);

  const formattedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <AdminProductClientPage products={formattedProducts} />;
}
