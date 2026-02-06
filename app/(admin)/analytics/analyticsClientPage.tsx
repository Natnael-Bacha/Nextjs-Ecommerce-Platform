"use client";

import { ProductOrderBarChart } from "@/components/productOrderBarChart";
import TwelveHourOrder from "@/components/tweleveHourOrderChart";

interface ChartData {
  hour: string;
  order: number;
}

interface BarData {
  name: string;
  orders: number;
}

interface AdminAnalyticsProps {
  data: ChartData[];
  barData: BarData[];
  totalOrder: number;
  twelevHourOrders: number;
  avgOrdersPerHour: number;
  peakHour: string;
}

export default function AdminAnalyticsDashboard({
  data,
  barData,
  totalOrder,
  twelevHourOrders,
  avgOrdersPerHour,
  peakHour,
}: AdminAnalyticsProps) {
  return (
    <div className="space-y-12 ">
      {/* Header */}
      <div className="mx-6">
        <h1 className="text-3xl font-semibold text-zinc-900 ">
          Analytics Overview
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Track store performance and order activity in real time.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mx-6">
        <StatCard label="Total Orders" value={totalOrder} />

        <StatCard label="Last 12 Hours" value={twelevHourOrders} />

        <StatCard label="Avg / Hour" value={avgOrdersPerHour.toFixed(2)} />

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
          <p className="text-sm text-zinc-500">Peak Hour</p>

          <p className="mt-3 text-2xl font-semibold text-zinc-900">
            {new Date(peakHour).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {" – "}
            {new Date(
              new Date(peakHour).getTime() + 60 * 60 * 1000,
            ).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <p className="mt-1 text-xs text-zinc-400">Highest order volume</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mx-6">
        <ChartCard title="Orders in the Last 12 Hours">
          <TwelveHourOrder data={data} />
        </ChartCard>

        <ChartCard title="Ordered Products">
          <ProductOrderBarChart barData={barData} />
        </ChartCard>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-zinc-900">{value}</p>
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-zinc-200">
      <h2 className="mb-6 text-sm font-medium text-zinc-900">{title}</h2>
      {children}
    </div>
  );
}
