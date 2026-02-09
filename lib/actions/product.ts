"use server";

import { getServerSession } from "../get-session";
import { redirect, unauthorized } from "next/navigation";
import prisma from "../prisma";
import { ProductSchema, UpdateProductSchema } from "./validations";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { float32 } from "zod";
import { revalidatePath } from "next/cache";
import { pc } from "../pinecone";

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
    description: formData.get("description"),
  });

  if (!parsed.success) {
    throw new Error(
      "Validation failed: " + JSON.stringify(parsed.error.format()),
    );
  } else {
    try {
      const product = await prisma.product.create({
        data: {
          name: parsed.data.name,
          price: parsed.data.price,
          quantity: parsed.data.quantity,
          lowStockAt: parsed.data.lowStockAt,
          image: parsed.data.image,
          description: parsed.data.description,
        },
      });
      console.log("Product created");
      const indexInformation = parsed.data.name + " " + parsed.data.description;
      const embeddings = await pc.inference.embed({
        model: "multilingual-e5-large",
        inputs: [indexInformation],
        parameters: {
          inputType: "passage",
          truncate: "END",
        },
      });
      const embedding = embeddings.data[0];

      if (embedding.vectorType !== "dense") {
        throw new Error("Expected dense embedding");
      }

      const vectorValues = embedding.values;

      const index = pc.index({ name: process.env.PINECONE_INDEX! });

      await index.upsert({
        records: [
          {
            id: product.id,
            values: vectorValues,
          },
        ],
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
    description: formData.get("description"),
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

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        image: parsed.data.image,
      },
    });
    revalidatePath("/adminProductsPage");
    return { success: true };
  } catch (error) {
    console.error("Error Updating Product", error);
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

export async function searchProducts(userQuery?: string) {
  if (!userQuery) {
    return prisma.product.findMany({
      orderBy: { name: "asc" },
    });
  }

  const queryEmbedding = await pc.inference.embed({
    model: "multilingual-e5-large",
    inputs: [userQuery],
    parameters: {
      inputType: "passage",
      truncate: "END",
    },
  });

  const index = pc.index({ name: process.env.PINECONE_INDEX! });
  const vectorEmbedding = queryEmbedding.data[0];
  if (vectorEmbedding.vectorType !== "dense") {
    throw new Error("Expected dense embedding");
  }

  const embedding = vectorEmbedding.values;
  const searchResults = await index.query({
    vector: embedding,
    topK: 5,
    includeMetadata: true,
  });

  const productIds = searchResults.matches.map((m) => m.id);

  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
  });

  const relevanceOrder = new Map(productIds.map((id, index) => [id, index]));

  return products.sort((a, b) => {
    const rankA = relevanceOrder.get(a.id) ?? 999;
    const rankB = relevanceOrder.get(b.id) ?? 999;

    if (rankA !== rankB) return rankA - rankB;

    return a.name.localeCompare(b.name);
  });
}
