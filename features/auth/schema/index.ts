import { z } from "zod";

export const signInSchema = z.object({
  username: z.string().min(3, "at least 3 characters"),
  password: z.string().min(8, "at least 8 characters"),
});

export const signUpSchema = signInSchema.extend({
  email: z.email("invalid email"),
});

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;
