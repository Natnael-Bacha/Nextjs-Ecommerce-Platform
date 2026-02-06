import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";
import UserProductClientPage from "./userProductClient";
import { searchProduct } from "@/lib/actions/product";

export default async function userProductServer({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const session = await getServerSession();
  const user = session?.user;
  if (!user || user.role !== "user") unauthorized();
  const { query } = await searchParams;
  const products = await searchProduct(query);

  const formattedProducts = products
    .map((product) => ({
      ...product,
      price: Number(product.price),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return <UserProductClientPage products={formattedProducts} />;
}
