"use server";
import { unauthorized } from "next/navigation";
import { getServerSession } from "../get-session";
import prisma from "../prisma";
import { OrderStatus } from "@/app/generated/prisma/enums";
import { number } from "zod";

export async function getCustomerInfo() {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin" || !session?.user) unauthorized();

  try {
    const customers = await prisma.user.findMany({
      where: {
        role: {
          not: "admin",
        },
      },
    });
    return customers;
  } catch (error) {
    console.log("Error fetching customer informations", error);
    return [];
  }
}

export async function getOneCustomerInfo(userId: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (!session?.user || user?.role !== "admin") unauthorized();

  const customer = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      cart: {
        include: {
          items: {
            select: {
              product: true,
              quantity: true,
            },
          },
        },
      },
      orders: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          items: {
            select: {
              product: true,
              quantity: true,
              price: true,
            },
          },
        },
      },
    },
  });

  if (!customer) throw new Error("Customer not found");

  return customer;
}

export async function changeOrderStatus(id: string, status: OrderStatus) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin" || !session?.user) unauthorized();

  try {
    await prisma.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update order status");
  }
}
