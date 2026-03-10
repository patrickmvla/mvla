import {
  Lightbulb,
  FlaskConical,
  Compass,
  Hammer,
} from "lucide-react";

export interface InspirationLink {
  label: string;
  href: string;
}

export type IdeaStage = "thinking" | "researching" | "scoping" | "building";
export type IdeaComplexity = "small" | "medium" | "ambitious";

export const stageColor: Record<IdeaStage, string> = {
  thinking: "text-muted-foreground/50",
  researching: "text-muted-foreground/70",
  scoping: "text-muted-foreground/85",
  building: "text-muted-foreground",
};

export const stageIcon: Record<IdeaStage, React.ReactNode> = {
  thinking: <Lightbulb className="size-3" />,
  researching: <FlaskConical className="size-3" />,
  scoping: <Compass className="size-3" />,
  building: <Hammer className="size-3" />,
};

export const complexityLabel: Record<IdeaComplexity, string> = {
  small: "small",
  medium: "medium",
  ambitious: "ambitious",
};
