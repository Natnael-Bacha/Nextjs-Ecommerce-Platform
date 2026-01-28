import { getCartItems } from "@/lib/actions/cart";
import CartClient from "./CartPage";

export default async function CartPage() {
  const cartItems = await getCartItems();
  return <CartClient cartItems={cartItems ?? []} />;
}
