import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";
import UserProductClientPage from "./userProductClient";
import { searchProducts } from "@/lib/actions/product";

export default async function userProductServer({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await getServerSession();
  const user = session?.user;
  if (!user || user.role !== "user") unauthorized();
  const { query } = await searchParams;
  const products = await searchProducts(query);

  const formattedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <UserProductClientPage products={formattedProducts} />;
}
