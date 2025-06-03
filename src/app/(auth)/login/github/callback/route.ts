import type { OAuth2Tokens } from "arctic";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { env } from "@/env";
import { github } from "@/server/auth/oath";
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
} from "@/server/auth/session";
import { db } from "@/server/db";
import { userTable } from "@/server/db/schema";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const cookieStore = await cookies();
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null;

  if (code === null || state === null || storedState !== state)
    return new Response(null, { status: 400 });

  let tokens: OAuth2Tokens;
  try {
    tokens = await github.validateAuthorizationCode(code);
  } catch {
    // Invalid code or client credentials
    return new Response(null, { status: 400 });
  }

  const githubResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokens.accessToken()}`,
    },
  });
  const githubUser = await githubResponse.json();
  const githubUserId = githubUser.id;
  const githubUsername = githubUser.login;

  if (githubUserId !== env.MY_GITHUB_ID) {
    cookieStore.set(
      "custom_error",
      "You cannot login as an admin unless you are me :)",
      {
        path: "/",
        secure: env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 60,
        sameSite: "lax",
      },
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  }

  const existingUser = await db
    .select()
    .from(userTable)
    .where(eq(userTable.githubId, githubUserId));

  if (existingUser.length !== 0) {
    const sessionToken = generateSessionToken();
    const session = await createSession(sessionToken, existingUser[0]!.id);
    await setSessionTokenCookie(sessionToken, session.expiresAt);

    return new Response(null, {
      status: 302,
      headers: {
        Location: "/admin",
      },
    });
  }

  const user = await db
    .insert(userTable)
    .values({
      githubId: githubUserId,
      username: githubUsername,
    })
    .returning();

  const sessionToken = generateSessionToken();
  const session = await createSession(sessionToken, user[0]!.id);
  await setSessionTokenCookie(sessionToken, session.expiresAt);

  return new Response(null, {
    status: 302,
    headers: {
      Location: "/admin",
    },
  });
}
