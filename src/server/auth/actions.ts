"use server";

import { redirect } from "next/navigation";
import {
  deleteSessionCookie,
  getCurrentSession,
  invalidateSession,
} from "./session";

type ActionResult = {
  error: string | null;
};

export async function logout(): Promise<ActionResult> {
  const { session } = await getCurrentSession();

  if (!session) return { error: "Unauthorized" };

  await invalidateSession(session);
  await deleteSessionCookie();
  return redirect("/");
}
