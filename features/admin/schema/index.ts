import { z } from "zod";

export const createIdeaSchema = z.object({
  slug: z
    .string()
    .min(1, "slug is required")
    .regex(/^[a-z0-9-]+$/, "lowercase letters, numbers, and hyphens only"),
  title: z.string().min(1, "title is required"),
  category: z.string().min(1, "category is required"),
  description: z.string().min(1, "description is required"),
  content: z.string().min(1, "content is required"),
  tags: z.array(z.string()).min(1, "at least one tag is required"),
  stage: z.enum(["thinking", "researching", "scoping", "building"]),
  complexity: z.enum(["small", "medium", "ambitious"]),
  published: z.boolean(),
  inspirationLinks: z.array(
    z.object({
      label: z.string().min(1, "label is required"),
      href: z.string().url("must be a valid URL"),
    })
  ),
});

export type CreateIdeaValues = z.infer<typeof createIdeaSchema>;

export const createRabbitHoleSchema = z.object({
  title: z.string().min(1, "title is required"),
  description: z.string().min(1, "description is required"),
  category: z.enum(["paper", "repo", "book", "talk", "tool", "concept"]),
  tags: z.array(z.string()).min(1, "at least one tag is required"),
  url: z.string().url("must be a valid URL").optional().or(z.literal("")),
  repo: z.string().optional().or(z.literal("")),
  status: z.enum(["queued", "exploring", "absorbed"]),
  notes: z.string().min(1, "notes are required"),
  published: z.boolean(),
});

export type CreateRabbitHoleValues = z.infer<typeof createRabbitHoleSchema>;

export const createProjectSchema = z.object({
  name: z.string().min(1, "repo name is required"),
  status: z.enum(["active", "shipped"]),
  href: z.string().url("must be a valid URL"),
  description: z.string().min(1, "description is required"),
});

export type CreateProjectValues = z.infer<typeof createProjectSchema>;
