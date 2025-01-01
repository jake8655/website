import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

export const redis = Redis.fromEnv();
const FALLBACK_IP_ADDRESS = "0.0.0.0";

export async function getUserIp() {
  const heads = await headers();

  const forwardedFor = heads.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;

  return heads.get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
}

// TODO: rethink how this is fetched because it needs to be invalidated when the user likes a project
// maybe use convex for realtime updates?
export const getProjectLikeCount = async (projectId: string) => {
  const ip = await getUserIp();

  // Hash the IP and turn it into a hex string
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(ip),
  );
  const hash = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  const userHasLiked = await redis.exists(
    ["deduplicate", hash, projectId].join(":"),
  );

  const likes =
    (await redis.get<number>(["likes", "projects", projectId].join(":"))) ?? 0;

  return { likes, userHasLiked: userHasLiked === 1 };
};
