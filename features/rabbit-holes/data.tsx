import {
  BookOpen,
  GitFork,
  FileText,
  Mic,
  Wrench,
  Shapes,
} from "lucide-react";

export type RabbitHoleCategory = "paper" | "repo" | "book" | "talk" | "tool" | "concept";

export const categoryIcon: Record<RabbitHoleCategory, React.ReactNode> = {
  paper: <FileText className="size-3" />,
  repo: <GitFork className="size-3" />,
  book: <BookOpen className="size-3" />,
  talk: <Mic className="size-3" />,
  tool: <Wrench className="size-3" />,
  concept: <Shapes className="size-3" />,
};
