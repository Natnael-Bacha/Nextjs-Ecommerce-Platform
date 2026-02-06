"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ChartData {
  week: string;
  products: number;
}

export default function ProductChart({ data }: { data: ChartData[] }) {
  return (
    <div className="h-full w-full px-2 pb-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            vertical={false}
            strokeDasharray="3 3"
            stroke="#f4f4f5"
          />

          <XAxis
            dataKey="week"
            tickLine={false}
            axisLine={false}
            tick={{
              fill: "#a1a1aa",
              fontSize: 12,
              fontWeight: 500,
            }}
            dy={10}
          />

          <YAxis
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
            tick={{
              fill: "#a1a1aa",
              fontSize: 12,
              fontWeight: 500,
            }}
          />

          <Tooltip
            cursor={{
              stroke: "#6366f1",
              strokeWidth: 1.5,
              strokeDasharray: "4 4",
            }}
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #e4e4e7",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              padding: "12px",
            }}
            itemStyle={{
              color: "#4f46e5",
              fontSize: "13px",
              fontWeight: 700,
            }}
            labelStyle={{
              color: "#71717a",
              fontSize: "11px",
              marginBottom: "4px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          />

          <Area
            type="monotone"
            dataKey="products"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#chartGradient)"
            animationDuration={1500}
            activeDot={{
              r: 6,
              fill: "#6366f1",
              stroke: "#fff",
              strokeWidth: 3,
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
