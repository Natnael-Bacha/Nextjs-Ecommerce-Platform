import prisma from "@/lib/prisma";
import UpdateProductForm from "./updateProductClient";
import { forbidden, redirect } from "next/navigation";
import { getServerSession } from "@/lib/get-session";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: PageProps) {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    forbidden();
  }
  const resolvedSearchParams = await searchParams;
  const productId = resolvedSearchParams.id;

  if (typeof productId !== "string") {
    return redirect("/adminProductsPage");
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    redirect("/adminProductsPage");
  }

  const safeProduct = {
    ...product,
    price: product.price.toNumber(),
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Update Product</h1>
      <UpdateProductForm product={safeProduct} />
    </div>
  );
}
