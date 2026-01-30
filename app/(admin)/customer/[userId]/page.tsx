import OrderStatusSelect from "@/components/OrderStatusSelect";
import { getOneCustomerInfo } from "../../../../lib/actions/customerInfo";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function CustomerDetails({ params }: Props) {
  const { userId } = await params;
  const customer = await getOneCustomerInfo(userId);

  return (
    <div className="max-w-6xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">
        {customer.name} ({customer.email})
      </h1>

      {/* CART */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Cart</h2>
      {customer.cart ? (
        customer.cart.items.length > 0 ? (
          <ul className="space-y-2">
            {customer.cart.items.map((item) => (
              <li
                key={item.product.id}
                className="flex justify-between p-2 border rounded-lg"
              >
                <span>{item.product.name}</span>
                <span>
                  {item.quantity} x ${Number(item.product.price).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Cart is empty.</p>
        )
      ) : (
        <p className="text-gray-500">No cart found.</p>
      )}

      {/* ORDERS */}
      <h2 className="text-2xl font-semibold mt-8 mb-4">Orders</h2>
      {customer.orders.length > 0 ? (
        <div className="space-y-6">
          {customer.orders.map((order) => {
            const total = order.items.reduce(
              (sum, i) => sum + Number(i.price) * i.quantity,
              0,
            );
            return (
              <div key={order.id} className="p-4 border rounded-xl">
                <p className="font-semibold">Order #{order.id}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Total: ${total.toFixed(2)}
                  </p>

                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                  />
                </div>

                <ul className="mt-2 space-y-1">
                  {order.items.map((item) => (
                    <li key={item.product.id} className="flex justify-between">
                      <span>{item.product.name}</span>
                      <span>
                        {item.quantity} x ${Number(item.price).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No orders found.</p>
      )}
    </div>
  );
}
