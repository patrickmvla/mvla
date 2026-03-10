import { Hono } from "hono";
import { handle } from "hono/vercel";
import { auth } from "@/lib/auth";
import { github } from "@/features/github/api";
import { authApp } from "@/features/auth/api";
import { ideasApp } from "@/features/ideas/api";
import { rabbitHolesApp } from "@/features/rabbit-holes/api";

type AuthEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user | null;
    session: typeof auth.$Infer.Session.session | null;
  };
};

const app = new Hono<AuthEnv>().basePath("/api");

app.use("*", async (c, next) => {
  if (c.req.path.startsWith("/api/auth")) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!session) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  c.set("user", session.user);
  c.set("session", session.session);
  return next();
});

app.get("/health", (c) =>
  c.json({ status: "alive", timestamp: new Date().toISOString() })
);

const routes = app
  .route("/auth", authApp)
  .route("/github", github)
  .route("/ideas", ideasApp)
  .route("/rabbit-holes", rabbitHolesApp);

export type AppType = typeof routes;

export const GET = handle(app);
export const POST = handle(app);
