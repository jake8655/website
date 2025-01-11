import { type InferSelectModel, sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable as table } from "drizzle-orm/sqlite-core";

export const contactPostTable = table("contact_posts", {
  id: t.integer("id").primaryKey({ autoIncrement: true }),
  name: t.text("name").notNull(),
  email: t.text("email").notNull(),
  subject: t.text("subject").notNull(),
  message: t.text("message").notNull(),
  archived: t.integer("archived", { mode: "boolean" }).default(false),
  createdAt: t
    .integer("created_at", { mode: "timestamp" })
    .default(sql`(strftime('%s','now'))`)
    .notNull(),
});

export const userTable = table(
  "users",
  {
    id: t.integer("id").primaryKey({ autoIncrement: true }).notNull(),
    githubId: t.integer("github_id").notNull(),
    username: t.text("username").notNull(),
  },
  table => [t.index("users_github_id_idx").on(table.githubId)],
);

export const sessionTable = table("sessions", {
  id: t.text("id").primaryKey(),
  userId: t
    .integer("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: t
    .integer("expires_at", {
      mode: "timestamp",
    })
    .notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Contact = InferSelectModel<typeof contactPostTable>;
