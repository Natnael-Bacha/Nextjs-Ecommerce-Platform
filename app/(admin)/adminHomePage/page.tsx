import { getServerSession } from "@/lib/get-session";
import { unauthorized } from "next/navigation";
import AdminHomePageClient from "./adminHomePage";

export default async function AdminHomePage() {
  const session = await getServerSession();

  if (!session?.user || session.user.role !== "admin") {
    unauthorized();
  }

  return <AdminHomePageClient />;
}
