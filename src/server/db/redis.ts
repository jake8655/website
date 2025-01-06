import { type Duration, Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { waitUntil } from "@vercel/functions";
import { headers } from "next/headers";

export const redis = Redis.fromEnv();

export const createRatelimiter = (tokens: number, window: Duration) => {
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: true,
  });
};

export async function getUserIp() {
  const heads = await headers();

  const forwardedFor = heads.get("x-forwarded-for");
  if (forwardedFor) {
    const [ip] = forwardedFor.split(",");
    if (ip) return ip;
    throw new Error("No IP found in X-Forwarded-For header");
  }

  const ip = heads.get("x-real-ip");
  if (ip) return ip;
  throw new Error("No IP found in X-Real-IP header");
}

export const ratelimit = async (ratelimiter: Ratelimit) => {
  const result = await ratelimiter.limit(await getUserIp());
  waitUntil(result.pending);

  return result;
};

export class RatelimitError extends Error {
  reset: number;

  constructor(reset: number) {
    super("Too many requests");
    this.reset = reset;
  }
}
