import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.get("/health", (c) => {
  return c.json({
    status: "alive",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get("/now", (c) => {
  return c.json({
    building: "mvla — personal site",
    learning: "systems design at scale",
    reading: "staff engineer by will larson",
    listening: "ambient electronica",
    updated: "2026-03",
  });
});

export const GET = handle(app);
export const POST = handle(app);
