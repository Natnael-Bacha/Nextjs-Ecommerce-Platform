import React from "react";
import AdminSidebar from "@/components/AdminSidebar"; // adjust path
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-zinc-50">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
