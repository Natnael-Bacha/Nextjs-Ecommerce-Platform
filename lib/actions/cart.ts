"use server";

import prisma from "../prisma";
import { getServerSession } from "@/lib/get-session";
import { unauthorized } from "next/navigation";

export async function addToCart(productId: string) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    unauthorized();
  }

  const userId = session.user.id;

  const cart = await prisma.cart.upsert({
    where: { userId },
    update: {},
    create: {
      userId,
    },
  });

  const existingItem = await prisma.cartItem.findUnique({
    where: {
      cartId_productId: {
        cartId: cart.id,
        productId,
      },
    },
  });

  if (existingItem) {
    try {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: {
            increment: 1,
          },
        },
      });
    } catch (error) {
      console.log("Error while updating cart", error);
    }
  } else {
    try {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity: 1,
        },
      });
    } catch (error) {
      console.log("error while creating cart", error);
    }
  }
}

export async function getCartItems() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    unauthorized();
  }
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });

    return (
      cart?.items.map((item) => ({
        id: item.id,
        cartId: item.cartId,
        quantity: item.quantity,
        product: {
          id: item.product.id,
          name: item.product.name,
          image: item.product.image,
          price: Number(item.product.price),
        },
      })) ?? []
    );
  } catch (error) {
    console.log("Error occured while fetching cart items", error);
    return [];
  }
}

export async function removeCartItem(cartItemId: string, cartId: string) {
  const session = await getServerSession();

  if (!session?.user?.id) {
    unauthorized();
  }

  await prisma.cartItem.delete({
    where: {
      id: cartItemId,
      cartId,
    },
  });
}

export async function checkout() {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) unauthorized();

  return await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    for (const item of cart.items) {
      if (item.product.quantity < item.quantity) {
        throw new Error(`Not enough stock for ${item.product.name}`);
      }
    }

    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "PAID",
        items: {
          create: cart.items.map((item) => ({
            quantity: item.quantity,
            price: item.product.price,
            product: {
              connect: {
                id: item.productId,
              },
            },
          })),
        },
      },
    });

    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });
    }

    await tx.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return order;
  });
}

export async function updateCartQuantity(itemId: string, quantity: number) {
  await prisma.cartItem.update({
    where: { id: itemId },
    data: {
      quantity,
    },
  });
}
