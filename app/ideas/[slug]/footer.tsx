import Link from "next/link";
import { ideas, stageColor, stageIcon, type Idea } from "../data";

const stageMessage: Record<Idea["stage"], string> = {
  thinking: "this is still just a spark. might go somewhere, might not.",
  researching:
    "actively digging into this — reading, prototyping, mapping the landscape.",
  scoping: "the research is done. figuring out what to build first.",
  building: "this one's in motion. shipping soon.",
};

export function IdeaFooter({ idea }: { idea: Idea }) {
  const currentIndex = ideas.findIndex((i) => i.slug === idea.slug);
  const next =
    ideas.length > 1 ? ideas[(currentIndex + 1) % ideas.length] : null;
  const showNext = next && next.slug !== idea.slug;

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
            className={`inline-flex items-center gap-1 ${stageColor[idea.stage]}`}
          >
            {stageIcon[idea.stage]}
            {idea.stage}
          </span>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground/50">
        {stageMessage[idea.stage]}
      </p>

      {showNext && (
        <Link
          href={`/ideas/${next.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary"
        >
          next idea: {next.title} &rarr;
        </Link>
      )}

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
