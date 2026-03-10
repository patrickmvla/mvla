import { Hono } from "hono";
import { auth } from "@/lib/auth";

export const authApp = new Hono()
  .on(["POST", "GET"], "/*", (c) => {
    return auth.handler(c.req.raw);
  });
