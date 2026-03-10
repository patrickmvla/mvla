import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE!,
  authToken: process.env.TURSO_TOKEN,
});

export const db = drizzle({ client, schema });
