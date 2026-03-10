import Link from "next/link";
import {
  stageColor,
  stageIcon,
  type IdeaStage,
} from "@/features/ideas/data";

const stageMessage: Record<IdeaStage, string> = {
  thinking: "this is still just a spark. might go somewhere, might not.",
  researching:
    "actively digging into this — reading, prototyping, mapping the landscape.",
  scoping: "the research is done. figuring out what to build first.",
  building: "this one's in motion. shipping soon.",
};

export function IdeaFooter({ slug, stage }: { slug: string; stage: IdeaStage }) {
  return (
    <footer className="mt-16 border-t border-border pt-6 pb-10">
      <div className="flex items-center justify-between">
        <Link
          href="/ideas"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          &larr; all ideas
        </Link>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground/60">
          <span>this idea is</span>
          <span
            className={`inline-flex items-center gap-1 ${stageColor[stage]}`}
          >
            {stageIcon[stage]}
            {stage}
          </span>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground/50">
        {stageMessage[stage]}
      </p>

      <div className="mt-6 text-[11px] text-muted-foreground/40">
        if this resonates or you&apos;re working on something similar —{" "}
        <a
          href="https://x.com/1gkohi"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground/50 transition-colors hover:text-primary"
        >
          reach out
        </a>
        .
      </div>
    </footer>
  );
}
