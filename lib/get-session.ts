import { cache } from "react";
import { auth } from "./auth";
import { headers } from "next/headers";

export const getServerSession = cache(async () => {
  return await auth.api.getSession({ headers: await headers() });
});

export async function checkUserRole() {
  const session = await getServerSession();
  if (!session?.user || session.user.role !== "admin") {
    return false;
  } else {
    return true;
  }
}
