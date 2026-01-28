import { checkUserRole } from "@/lib/get-session";
import SigninForm from "./sign-in-form";
import { unauthorized } from "next/navigation";

export default function AdminSignInPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-zinc-50 px-4 py-12">
      <SigninForm />
    </div>
  );
}
