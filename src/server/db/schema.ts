import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";

export const contactPosts = table("contact_posts", {
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull(),
  email: t.text("email").notNull(),
  subject: t.text("subject").notNull(),
  message: t.text("message").notNull(),
  createdAt: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`).notNull(),
});
