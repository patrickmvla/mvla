import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { username, admin } from "better-auth/plugins";
import { eq, count } from "drizzle-orm";
import { db } from "./db";
import { user as userTable } from "./db/schema";
import * as schema from "./db/schema";

export const auth = betterAuth({
  basePath: "/api/auth",
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:3000"],
  plugins: [username(), admin()],
  databaseHooks: {
    user: {
      create: {
        after: async (newUser) => {
          const [{ total }] = await db
            .select({ total: count() })
            .from(userTable);
          if (total === 1) {
            await db
              .update(userTable)
              .set({ role: "admin" })
              .where(eq(userTable.id, newUser.id));
          }
        },
      },
    },
  },
});
