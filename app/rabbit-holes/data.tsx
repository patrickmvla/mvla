import {
  BookOpen,
  GitFork,
  FileText,
  Mic,
  Wrench,
  Shapes,
} from "lucide-react";

export interface RabbitHole {
  title: string;
  description: string;
  category: "paper" | "repo" | "book" | "talk" | "tool" | "concept";
  tags: string[];
  url?: string;
  repo?: string;
  status: "queued" | "exploring" | "absorbed";
  notes?: string;
}

export const categoryIcon: Record<RabbitHole["category"], React.ReactNode> = {
  paper: <FileText className="size-3" />,
  repo: <GitFork className="size-3" />,
  book: <BookOpen className="size-3" />,
  talk: <Mic className="size-3" />,
  tool: <Wrench className="size-3" />,
  concept: <Shapes className="size-3" />,
};

export const holes: RabbitHole[] = [
  {
    title: "database internals",
    description:
      "alex petrov — deep dive into storage engines, B-trees, LSM-trees, distributed systems primitives. understanding databases at the metal level.",
    category: "book",
    tags: ["databases", "distributed systems", "storage engines"],
    status: "exploring",
    notes: "starting from the bottom — how data actually hits disk.",
  },
  {
    title: "opencode",
    description:
      "terminal-native AI coding agent. reading through the entire codebase to understand how it's architected.",
    category: "repo",
    tags: ["ai", "cli", "agents", "typescript"],
    status: "exploring",
    repo: "https://github.com/anomalyco/opencode",
    notes: "obsessed with how they structured this.",
  },
];
