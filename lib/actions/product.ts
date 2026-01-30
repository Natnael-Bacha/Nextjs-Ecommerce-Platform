"use server";

import { getServerSession } from "../get-session";
import { redirect, unauthorized } from "next/navigation";
import prisma from "../prisma";
import { ProductSchema, UpdateProductSchema } from "./validations";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { float32 } from "zod";

export async function createProduct(formData: FormData) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin" || !session?.user) unauthorized();

  const parsed = ProductSchema.safeParse({
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    lowStockAt: formData.get("lowStockAt"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    throw new Error(
      "Validation failed: " + JSON.stringify(parsed.error.format()),
    );
  } else {
    const file = parsed.data.image as File;
    const buffer = Buffer.from(await file.arrayBuffer());

    const ext = path.extname(file.name);
    const filename = crypto.randomUUID() + ext;

    const uploadPath = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const fullPath = path.join(uploadPath, filename);
    fs.writeFileSync(fullPath, buffer);

    const imageUrl = `/uploads/${filename}`;

    try {
      await prisma.product.create({
        data: {
          name: parsed.data.name,
          price: parsed.data.price,
          quantity: parsed.data.quantity,
          lowStockAt: parsed.data.lowStockAt,
          image: imageUrl,
        },
      });

      return { success: true };
    } catch (error) {
      console.log("Error Creating Product", error);
      return { success: false, error: (error as Error).message };
    }
  }
}

export async function updateProduct(formData: FormData) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin" || !user) unauthorized();

  const parsed = UpdateProductSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    lowStockAt: formData.get("lowStockAt"),
    image: formData.get("image"),
  });

  if (!parsed.success) {
    throw new Error(
      "Validation failed: " + JSON.stringify(parsed.error.format()),
    );
  }

  const { id, image, ...rest } = parsed.data;

  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!existingProduct) {
    throw new Error("Product not found");
  }

  let imageUrl = existingProduct.image;

  if (image && image instanceof File && image.size > 0) {
    const buffer = Buffer.from(await image.arrayBuffer());

    const ext = path.extname(image.name);
    const filename = crypto.randomUUID() + ext;
    const uploadPath = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadPath, filename), buffer);

    imageUrl = `/uploads/${filename}`;

    if (existingProduct.image) {
      const oldPath = path.join(process.cwd(), "public", existingProduct.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  }
  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        image: imageUrl,
      },
    });
    return { success: true };
  } catch (error) {
    console.log("Error Creating Product", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteProduct(productId: string) {
  const session = await getServerSession();
  const user = session?.user;

  if (user?.role !== "admin" || !user) unauthorized();

  if (!productId) {
    throw new Error("Product ID is required");
  }
  const id = productId;
  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.image) {
    const imagePath = path.join(process.cwd(), "public", product.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  try {
    await prisma.product.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.log("Error Deleting Product", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function buyProduct(productId: string, quantity: number) {
  const session = await getServerSession();
  const userId = session?.user?.id;

  if (!userId) unauthorized();
  if (quantity <= 0) throw new Error("Invalid quantity");

  return await prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.quantity < quantity) {
      throw new Error("Insufficient stock");
    }

    await tx.product.update({
      where: { id: productId },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    const total = Number(product.price) * quantity;

    const order = await tx.order.create({
      data: {
        userId,
        total,
        status: "PAID",
        items: {
          create: {
            productId: product.id,
            quantity,
            price: product.price,
          },
        },
      },
    });

    return order;
  });
}
