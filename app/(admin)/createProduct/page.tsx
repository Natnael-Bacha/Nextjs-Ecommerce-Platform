import { getServerSession } from "@/lib/get-session";
import { forbidden, redirect, unauthorized } from "next/navigation";
import CreateProductClient from "./CreateProductClient";

export default async function CreateProductPage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    forbidden();
  }

  return <CreateProductClient />;
}
