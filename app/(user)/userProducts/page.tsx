import { getServerSession } from "@/lib/get-session";
import prisma from "@/lib/prisma";
import { unauthorized } from "next/navigation";
import Image from "next/image";
import AddToCartButton from "@/components/addToCart";

export default async function UserProduct() {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) unauthorized();

  const products = await prisma.product.findMany({
    where: {
      quantity: {
        gt: 0,
      },
    },
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      quantity: true,
    },
  });

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col rounded-xl border shadow-sm"
          >
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-gray-100">
              {product.image && (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex flex-1 flex-col p-4">
              <h2 className="mb-1 font-medium">{product.name}</h2>
              <p className="mb-2 text-sm text-gray-500">
                ${product.price.toFixed(2)}
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Available: {product.quantity}
              </p>

              <div className="mt-auto flex gap-2">
                <AddToCartButton productId={product.id} />
                <button className="flex-1 rounded-lg bg-black px-3 py-2 text-sm text-white hover:bg-gray-800">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full rounded-xl border p-10 text-center text-gray-500">
            No products available
          </div>
        )}
      </div>
    </div>
  );
}
