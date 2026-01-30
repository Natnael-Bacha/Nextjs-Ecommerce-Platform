import { authClient } from "./auth-client";

export async function logOut() {
  try {
    await authClient.signOut();
    return { success: true };
  } catch (error) {
    console.error("Error logging out:", error);
    return { success: false, message: (error as Error).message };
  }
}
