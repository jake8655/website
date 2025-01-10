import { env } from "@/env";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.set("custom_error", "", {
    path: "/",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60,
    sameSite: "lax",
  });

  return new Response(null, {
    status: 200,
  });
}