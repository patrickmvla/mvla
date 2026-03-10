import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { db } from "@/lib/db";
import { rabbitHoles } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { createRabbitHoleSchema } from "@/features/admin/schema";

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

export const rabbitHolesApp = new Hono()
  .post(
    "/",
    zv("json", createRabbitHoleSchema),
    async (c) => {
      const user = c.get("user" as never) as { role?: string } | null;
      if (!user || user.role !== "admin") {
        return c.json({ error: "unauthorized" }, 401);
      }

      const data = c.req.valid("json");

      try {
        const [rabbitHole] = await db
          .insert(rabbitHoles)
          .values({
            title: data.title,
            description: data.description,
            category: data.category,
            tags: data.tags,
            url: data.url || null,
            repo: data.repo || null,
            status: data.status,
            notes: data.notes,
            published: data.published,
          })
          .returning();

        return c.json({ rabbitHole }, 201);
      } catch (err) {
        console.error("failed to create rabbit hole:", err);
        return c.json({ error: "failed to create rabbit hole" }, 500);
      }
    }
  )
  .get("/", async (c) => {
    const published = c.req.query("published");
    const rows = await db.select().from(rabbitHoles);
    const filtered =
      published === "true"
        ? rows.filter((r) => r.published)
        : published === "false"
          ? rows.filter((r) => !r.published)
          : rows;

    return c.json({ rabbitHoles: filtered });
  })
  .post("/:id/view", async (c) => {
    const id = Number(c.req.param("id"));

    const updated = await db
      .update(rabbitHoles)
      .set({ viewCount: sql`${rabbitHoles.viewCount} + 1` })
      .where(eq(rabbitHoles.id, id))
      .returning({ viewCount: rabbitHoles.viewCount });

    if (updated.length === 0) return c.json({ error: "not found" }, 404);

    return c.json({ viewCount: updated[0].viewCount });
  });
