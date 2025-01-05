import { contactFormSchema } from "@/lib/utils";
import { RatelimitError } from "@/server/db/redis";
import { contactPosts } from "@/server/db/schema";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const contactRouter = createTRPCRouter({
  createContactMessage: publicProcedure
    .input(contactFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { success, reset } = await ctx.ratelimit(
        ctx.createRatelimiter(5, "10 m"),
      );

      if (!success) {
        throw new RatelimitError(reset);
      }

      await ctx.db.insert(contactPosts).values({
        name: input.name,
        email: input.email,
        subject: input.subject,
        message: input.message,
      });

      return { success: true };
    }),
});
