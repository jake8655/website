import { RatelimitError } from "@/lib/utils";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { waitUntil } from "@vercel/functions";
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const redis = Redis.fromEnv();
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "5 m"),
  analytics: true,
});

async function getUserIp() {
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

export const projectLikeRouter = createTRPCRouter({
  getProjectLikeCount: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const ip = await getUserIp();

      const hash = await hashIp(ip);

      const userHasLiked = await redis.exists(
        ["deduplicate", hash, input.projectId].join(":"),
      );

      const likes =
        (await redis.get<number>(
          ["likes", "projects", input.projectId].join(":"),
        )) ?? 0;

      return { likes, userHasLiked: userHasLiked === 1 };
    }),

  likeProject: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const ip = await getUserIp();

      const { success, reset, pending } = await ratelimit.limit(ip);
      waitUntil(pending);

      if (!success) {
        throw new RatelimitError(reset);
      }

      const hash = await hashIp(ip);

      const isNew = await redis.set(
        ["deduplicate", hash, input.projectId].join(":"),
        "1",
        {
          nx: true,
        },
      );

      if (isNew) {
        const newLikes = await redis.incr(
          ["likes", "projects", input.projectId].join(":"),
        );

        return {
          likes: newLikes,
          userHasLiked: true,
        };
      }

      const [newLikes] = await redis
        .multi()
        .decr(["likes", "projects", input.projectId].join(":"))
        .del(["deduplicate", hash, input.projectId].join(":"))
        .exec();

      return {
        likes: newLikes,
        userHasLiked: false,
      };
    }),
});

const hashIp = unstable_cache(
  async (ip: string) => {
    // Hash the IP and turn it into a hex string
    const buf = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(ip),
    );
    const hash = Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, "0"))
      .join("");

    return hash;
  },
  [],
  {
    // Cache IPs for 1 day and then revalidate to not clutter cache storage with a bunch of IPs
    revalidate: 60 * 60 * 24,
  },
);
