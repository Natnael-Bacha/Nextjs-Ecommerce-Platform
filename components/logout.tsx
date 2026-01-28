"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { LogOut } from "lucide-react";
import { logOut } from "@/lib/authActions";

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLogout = () => {
    startTransition(async () => {
      const res = await logOut();
      if (res.success) {
        toast.success("Logged out successfully!");
        router.push("/sign-in"); // optional redirect
      } else {
        toast.error(`Failed to log out: ${res.message}`);
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-1 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
    >
      <LogOut size={16} />
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
