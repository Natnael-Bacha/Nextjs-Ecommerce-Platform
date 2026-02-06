import {
  getAverageOfOrdersPerHour,
  getNumberOfOrderForTwelveHours,
  getNumberOfOrders,
  getPeakHour,
  productOrderData,
  tweleveHourOrder,
} from "@/lib/actions/stats";
import { getServerSession } from "@/lib/get-session";
import { unauthorized } from "next/navigation";
import AnalyticsClientPage from "./analyticsClientPage";

export default async function AnalyticsServerPage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    unauthorized();
  }

  const data = await tweleveHourOrder();
  const barData = await productOrderData();
  const totalOrder = Number(await getNumberOfOrders());
  const tweleveHourOrders = Number(await getNumberOfOrderForTwelveHours());
  const avgOrdersPerHour = Number(await getAverageOfOrdersPerHour());
  const peakHour = await getPeakHour();
  return (
    <AnalyticsClientPage
      data={data}
      barData={barData}
      totalOrder={totalOrder}
      twelevHourOrders={tweleveHourOrders}
      avgOrdersPerHour={avgOrdersPerHour}
      peakHour={peakHour.hour}
    />
  );
}
