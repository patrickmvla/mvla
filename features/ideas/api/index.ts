import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { ideas, inspirationLinks } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { createIdeaSchema } from "@/features/admin/schema";

const zv = <T extends Parameters<typeof zValidator>[1]>(
  target: Parameters<typeof zValidator>[0],
  schema: T
) =>
  zValidator(target, schema, (result, c) => {
    if (!result.success) {
      const message = result.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      return c.json({ error: message }, 400);
    }
  });

export const ideasApp = new Hono()
  .post(
    "/",
    zv("json", createIdeaSchema),
    async (c) => {
      const user = c.get("user" as never) as { role?: string } | null;
      if (!user || user.role !== "admin") {
        return c.json({ error: "unauthorized" }, 401);
      }

      const data = c.req.valid("json");
      const now = new Date().toISOString();

      const existing = await db
        .select({ id: ideas.id })
        .from(ideas)
        .where(eq(ideas.slug, data.slug));
      if (existing.length > 0) {
        return c.json({ error: "slug already taken" }, 409);
      }

      try {
        const [idea] = await db
          .insert(ideas)
          .values({
            slug: data.slug,
            title: data.title,
            category: data.category,
            description: data.description,
            content: data.content,
            tags: data.tags,
            stage: data.stage,
            complexity: data.complexity,
            published: data.published,
            dateAdded: now,
            lastUpdated: now,
          })
          .returning();

        if (data.inspirationLinks.length > 0) {
          await db.insert(inspirationLinks).values(
            data.inspirationLinks.map((link) => ({
              ideaId: idea.id,
              label: link.label,
              href: link.href,
            }))
          );
        }

        return c.json({ idea }, 201);
      } catch (err) {
        console.error("failed to create idea:", err);
        return c.json({ error: "failed to create idea" }, 500);
      }
    }
  )
  .get("/", async (c) => {
    const published = c.req.query("published");
    const rows = await db.select().from(ideas);
    const filtered =
      published === "true"
        ? rows.filter((r) => r.published)
        : published === "false"
          ? rows.filter((r) => !r.published)
          : rows;

    return c.json({ ideas: filtered });
  })
  .get("/:slug", async (c) => {
    const slug = c.req.param("slug");
    const [idea] = await db.select().from(ideas).where(eq(ideas.slug, slug));
    if (!idea) return c.json({ error: "not found" }, 404);

    const links = await db
      .select()
      .from(inspirationLinks)
      .where(eq(inspirationLinks.ideaId, idea.id));

    return c.json({ idea, inspirationLinks: links });
  })
  .post("/:slug/view", async (c) => {
    const slug = c.req.param("slug");

    const updated = await db
      .update(ideas)
      .set({ viewCount: sql`${ideas.viewCount} + 1` })
      .where(eq(ideas.slug, slug))
      .returning({ viewCount: ideas.viewCount });

    if (updated.length === 0) return c.json({ error: "not found" }, 404);

    return c.json({ viewCount: updated[0].viewCount });
  });
