import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export * from "./auth-schema";

export const ideas = sqliteTable("ideas", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  tags: text("tags", { mode: "json" }).notNull().$type<string[]>(),
  stage: text("stage", {
    enum: ["thinking", "researching", "scoping", "building"],
  }).notNull(),
  complexity: text("complexity", {
    enum: ["small", "medium", "ambitious"],
  }).notNull(),
  dateAdded: text("date_added").notNull(),
  lastUpdated: text("last_updated").notNull(),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
});

export const inspirationLinks = sqliteTable("inspiration_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ideaId: integer("idea_id")
    .notNull()
    .references(() => ideas.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  href: text("href").notNull(),
});

export const rabbitHoles = sqliteTable("rabbit_holes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: ["paper", "repo", "book", "talk", "tool", "concept"],
  }).notNull(),
  tags: text("tags", { mode: "json" }).notNull().$type<string[]>(),
  url: text("url"),
  repo: text("repo"),
  status: text("status", {
    enum: ["queued", "exploring", "absorbed"],
  }).notNull(),
  notes: text("notes").notNull(),
  dateAdded: text("date_added").notNull().default("2025-01-01"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
});
