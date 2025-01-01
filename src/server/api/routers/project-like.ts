import { Redis } from "@upstash/redis";
import { headers } from "next/headers";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

const redis = Redis.fromEnv();
const FALLBACK_IP_ADDRESS = "0.0.0.0";

async function getUserIp() {
  const heads = await headers();

  const forwardedFor = heads.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS;

  return heads.get("x-real-ip") ?? FALLBACK_IP_ADDRESS;
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

      // Hash the IP and turn it into a hex string
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
      );
      const hash = Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

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

      // Hash the IP and turn it into a hex string
      const buf = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(ip),
      );
      const hash = Array.from(new Uint8Array(buf))
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      const isNew = await redis.set(
        ["deduplicate", hash, input.projectId].join(":"),
        "1",
        {
          nx: true,
        },
      );

      const likes =
        (await redis.get<number>(
          ["likes", "projects", input.projectId].join(":"),
        )) ?? 0;

      if (isNew) {
        await redis.incr(["likes", "projects", input.projectId].join(":"));

        return {
          likes: likes + 1,
          userHasLiked: true,
        };
      }

      await redis.decr(["likes", "projects", input.projectId].join(":"));
      await redis.del(["deduplicate", hash, input.projectId].join(":"));

      return {
        likes: likes - 1,
        userHasLiked: false,
      };
    }),
});
