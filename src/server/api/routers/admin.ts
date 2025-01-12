import { contactPostTable } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const adminRouter = createTRPCRouter({
  getMessageData: protectedProcedure.query(async ({ ctx }) => {
    const data = await ctx.db
      .select()
      .from(contactPostTable)
      .orderBy(desc(contactPostTable.createdAt));

    return data;
  }),

  toggleMessageArchived: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const currentPost = await ctx.db
        .select()
        .from(contactPostTable)
        .where(eq(contactPostTable.id, input.messageId));

      await ctx.db
        .update(contactPostTable)
        .set({
          archived: !currentPost[0]!.archived,
        })
        .where(eq(contactPostTable.id, input.messageId));

      return { success: true };
    }),

  deleteMessage: protectedProcedure
    .input(
      z.object({
        messageId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(contactPostTable)
        .where(eq(contactPostTable.id, input.messageId));

      return { success: true };
    }),
});
