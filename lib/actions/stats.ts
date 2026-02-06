"use server";
import { unauthorized } from "next/navigation";
import { getServerSession } from "../get-session";
import prisma from "../prisma";
import { OrderStatus, Prisma } from "@/app/generated/prisma/client";

export async function getNumberOfCustomers() {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin" || !session?.user) unauthorized();
  return prisma.user.count();
}

export async function getTotalRevenue() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();

  const result = await prisma.$queryRaw<{ total: Prisma.Decimal }[]>`
    SELECT COALESCE(SUM(price * quantity), 0) AS total
    FROM "OrderItem"
  `;

  return result[0].total;
}

export async function getNumberOfProducts() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();

  return await prisma.product.count();
}

export async function getTotalSales() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();

  return await prisma.order.count({
    where: {
      status: {
        in: [OrderStatus.DELIVERED, OrderStatus.SHIPPED],
      },
    },
  });
}

export async function weeklyProductData() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();

  const now = new Date();
  const weeklyProductData = [];

  for (let i = 11; i > 0; i--) {
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - i * 7);
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(weekStart.getDate()).padStart(2, "0")}`;

    const productCount = await prisma.product.count({
      where: {
        createdAt: {
          gte: weekStart,
          lte: weekEnd,
        },
      },
    });

    weeklyProductData.push({
      week: weekLabel,
      products: productCount,
    });
  }

  return weeklyProductData;
}

export async function tweleveHourOrder() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();
  const tweleveHourOrderData = [];
  const now = new Date();

  for (let i = 12; i >= 0; i--) {
    const startTime = new Date(now);
    startTime.setHours(startTime.getHours() - i);
    startTime.setMinutes(0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + 1);
    endTime.setMilliseconds(-1);

    const order = await prisma.order.count({
      where: {
        createdAt: {
          lte: endTime,
          gte: startTime,
        },
      },
    });
    const hourLabel = `${String(startTime.getHours()).padStart(2, "0")}:00`;
    tweleveHourOrderData.push({
      hour: hourLabel,
      order: order,
    });
  }

  return tweleveHourOrderData;
}

export async function productOrderData() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId"],
    _sum: {
      quantity: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: 10,
  });

  const products = await prisma.product.findMany({
    where: {
      id: { in: grouped.map((g) => g.productId) },
    },
    select: {
      id: true,
      name: true,
    },
  });

  return grouped.map((g) => ({
    name: products.find((p) => p.id === g.productId)?.name ?? "Unknown",
    orders: g._sum.quantity ?? 0,
  }));
}

export async function getNumberOfOrders() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();

  const order = await prisma.order.count({});

  return order;
}

export async function getNumberOfOrderForTwelveHours() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();
  const now = new Date();

  const twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(now.getHours() - 12);

  const twelveHourOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: twelveHoursAgo,
        lte: now,
      },
    },
  });

  return twelveHourOrders;
}

export async function getAverageOfOrdersPerHour() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();
  const now = new Date();

  const twelveHoursAgo = new Date();
  twelveHoursAgo.setHours(now.getHours() - 12);

  const twelveHourOrders = await prisma.order.count({
    where: {
      createdAt: {
        gte: twelveHoursAgo,
        lte: now,
      },
    },
  });
  const twelveHourOrdersAverage = twelveHourOrders / 12;
  return twelveHourOrdersAverage;
}

export async function getPeakHour() {
  const session = await getServerSession();
  const user = session?.user;

  if (!user || user.role !== "admin") unauthorized();

  const now = new Date();

  const ordersPerHour: { hour: string; count: number }[] = [];

  for (let i = 11; i >= 0; i--) {
    const startHour = new Date(now);
    startHour.setHours(now.getHours() - i - 1);
    startHour.setMinutes(0, 0, 0);

    const endHour = new Date(startHour);
    endHour.setHours(startHour.getHours() + 1);

    const count = await prisma.order.count({
      where: {
        createdAt: {
          gte: startHour,
          lt: endHour,
        },
      },
    });

    ordersPerHour.push({
      hour: startHour.toISOString(),
      count,
    });
  }

  const peakHour = ordersPerHour.reduce((max, current) =>
    current.count > max.count ? current : max,
  );

  return peakHour;
}
