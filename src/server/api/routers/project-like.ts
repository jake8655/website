import { RatelimitError, getUserIp } from "@/server/db/redis";
import { unstable_cache } from "next/cache";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const projectLikeRouter = createTRPCRouter({
  getProjectLikeCount: publicProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const ip = await getUserIp();

      const hash = await hashIp(ip);

      const userHasLiked = await ctx.redis.exists(
        ["deduplicate", hash, input.projectId].join(":"),
      );

      const likes =
        (await ctx.redis.get<number>(
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
    .mutation(async ({ input, ctx }) => {
      const { success, reset } = await ctx.ratelimit(
        ctx.createRatelimiter(20, "5 m"),
      );

      if (!success) {
        throw new RatelimitError(reset);
      }

      const ip = await getUserIp();
      const hash = await hashIp(ip);

      const isNew = await ctx.redis.set(
        ["deduplicate", hash, input.projectId].join(":"),
        "1",
        {
          nx: true,
        },
      );

      if (isNew) {
        const newLikes = await ctx.redis.incr(
          ["likes", "projects", input.projectId].join(":"),
        );

        return {
          likes: newLikes,
          userHasLiked: true,
        };
      }

      const [newLikes] = await ctx.redis
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
