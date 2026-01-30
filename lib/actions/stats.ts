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
