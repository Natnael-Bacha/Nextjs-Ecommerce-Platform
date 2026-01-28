import UserNavbar from "@/components/UserNavbar";
import { getCartItems } from "@/lib/actions/cart";
import { getServerSession } from "@/lib/get-session";
import { unauthorized } from "next/navigation";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  const user = session?.user;
  if (!user) unauthorized();
  const cartItems = await getCartItems();
  const userInfo = { name: user?.firstName, cartCount: cartItems.length };

  return (
    <html lang="en">
      <body className="bg-gray-50">
        <UserNavbar userName={userInfo.name} cartCount={userInfo.cartCount} />
        <main>{children}</main>
      </body>
    </html>
  );
}
