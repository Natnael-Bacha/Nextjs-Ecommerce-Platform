import { getServerSession } from "@/lib/get-session";
import { unauthorized } from "next/navigation";
import AdminHomePageClient from "./adminHomePage";
import {
  getNumberOfCustomers,
  getNumberOfProducts,
  getTotalRevenue,
  getTotalSales,
} from "@/lib/actions/stats";

export default async function AdminHomePage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    unauthorized();
  }

  const numberOfCustomers = Number(await getNumberOfCustomers());
  const totalRevenue = Number(await getTotalRevenue());
  const numberOfProducts = Number(await getNumberOfProducts());
  const totalSales = Number(await getTotalSales());

  return (
    <AdminHomePageClient
      numberOfCustomers={numberOfCustomers}
      totalRevenue={totalRevenue}
      numberOfProducts={numberOfProducts}
      totalSales={totalSales}
    />
  );
}
