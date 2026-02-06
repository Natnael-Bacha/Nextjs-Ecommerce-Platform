import { getServerSession } from "@/lib/get-session";
import { unauthorized } from "next/navigation";
import AdminHomePageClient from "./adminHomePage";
import {
  getNumberOfCustomers,
  getNumberOfProducts,
  getTotalRevenue,
  getTotalSales,
  weeklyProductData,
} from "@/lib/actions/stats";

export default async function AdminHomePage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    unauthorized();
  }
  const data = await weeklyProductData();
  const numberOfCustomers = Number(await getNumberOfCustomers());
  const totalRevenue = Number(await getTotalRevenue());
  const numberOfProducts = Number(await getNumberOfProducts());
  const totalSales = Number(await getTotalSales());
  const dataGenerated = [
    { week: "11/16", products: 5 },
    { week: "11/23", products: 3 },
    { week: "11/30", products: 100 },
    { week: "12/07", products: 40 },
    { week: "12/14", products: 9 },
    { week: "12/21", products: 100 },
    { week: "12/28", products: 209 },
    { week: "01/04", products: 89 },
    { week: "01/11", products: 42 },
    { week: "01/18", products: 110 },
    { week: "01/25", products: 90 },
  ];
  return (
    <AdminHomePageClient
      numberOfCustomers={numberOfCustomers}
      totalRevenue={totalRevenue}
      numberOfProducts={numberOfProducts}
      totalSales={totalSales}
      data={dataGenerated}
    />
  );
}
