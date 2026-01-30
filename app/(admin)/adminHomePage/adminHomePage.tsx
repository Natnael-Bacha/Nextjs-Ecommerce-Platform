import Link from "next/link";
import { Toaster } from "sonner";
import { Plus, Search, Bell } from "lucide-react";
import LogoutButton from "@/components/logout";

interface AdminPageProps {
  numberOfCustomers: number;
  totalRevenue: number;
  numberOfProducts: number;
  totalSales: number;
}

export default function AdminHomePageClient({
  numberOfCustomers,
  totalRevenue,
  numberOfProducts,
  totalSales,
}: AdminPageProps) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <Toaster richColors position="top-right" />
      <main className="flex-1">
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-8">
          <div className="relative w-96">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search everything..."
              className="w-full rounded-md border border-zinc-200 bg-zinc-50 py-1.5 pl-10 pr-4 text-sm outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-zinc-900" />
            <LogoutButton />
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>
              <p className="text-sm text-zinc-500 font-medium">
                Manage your store and product catalog.
              </p>
            </div>

            <Link
              href="/createProduct"
              className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 active:scale-[0.98] shadow-sm"
            >
              <Plus size={18} />
              Create Product
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value={totalRevenue}
              change="+20.1%"
              isCurrency
            />
            <StatCard title="Sales" value={totalSales} change="+180.1%" />
            <StatCard
              title="Active Products"
              value={numberOfProducts}
              change="+3 new"
            />
            <StatCard
              title="Total Customers"
              value={numberOfCustomers}
              change="+20%"
            />
          </div>

          <div className="mt-8 rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="border-b border-zinc-100 p-6">
              <h2 className="font-semibold text-zinc-900">Recent Activity</h2>
            </div>
            <div className="flex h-64 items-center justify-center text-zinc-400 text-sm italic">
              Recent product updates and orders will appear here...
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,

  isCurrency = false,
}: {
  title: string;
  value: number;
  change: string;
  isCurrency?: boolean;
}) {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(value)
    : value.toLocaleString();

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
        {title}
      </p>
      <div className="mt-2 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold text-zinc-900">{formattedValue}</h3>
      </div>
    </div>
  );
}
