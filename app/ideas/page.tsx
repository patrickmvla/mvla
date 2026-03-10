import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { db } from "@/lib/db";
import { ideas as ideasTable, inspirationLinks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import {
  stageColor,
  stageIcon,
  complexityLabel,
  type IdeaStage,
  type IdeaComplexity,
} from "@/features/ideas/data";
import { InspirationLinks } from "@/features/ideas/components/inspiration-links";

export const dynamic = "force-dynamic";

function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try { return JSON.parse(tags); } catch { return []; }
  }
  return [];
}

export default async function Ideas() {
  const rows = await db
    .select()
    .from(ideasTable)
    .where(eq(ideasTable.published, true));

  const allLinks = rows.length > 0
    ? await db.select().from(inspirationLinks)
    : [];

  const ideas = rows.map((idea) => ({
    ...idea,
    stage: idea.stage as IdeaStage,
    complexity: idea.complexity as IdeaComplexity,
    links: allLinks.filter((l) => l.ideaId === idea.id),
  }));

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col p-6 sm:p-10">
      {/* Header */}
      <header className="mb-10">
        <Link
          href="/"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          &larr; back
        </Link>
        <h1 className="mt-4 text-xl font-medium tracking-tight text-primary">
          ideas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          caffeine is a bad additive. look where it got me.
        </p>
      </header>

      {/* Ideas list */}
      {ideas.length === 0 ? (
        <p className="text-sm text-muted-foreground/50">
          nothing here yet. brewing.
        </p>
      ) : (
        <div className="flex flex-col">
          {ideas.map((idea) => (
            <div
              key={idea.slug}
              className="border-t border-border py-6"
            >
              {/* Stage + complexity */}
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1.5 ${stageColor[idea.stage]}`}>
                  {stageIcon[idea.stage]}
                  <span className="text-[10px] uppercase tracking-widest">
                    {idea.stage}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground/30">
                  /
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {complexityLabel[idea.complexity]}
                </span>
              </div>

              {/* Title */}
              <Link
                href={`/ideas/${idea.slug}`}
                className="group mt-2 block"
              >
                <h2 className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                  {idea.title}
                  <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </h2>
              </Link>

              {/* Description */}
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {idea.description}
              </p>

              {/* Category + Tags */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="rounded-sm border border-border bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground">
                  {idea.category}
                </span>
                {parseTags(idea.tags).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Metadata row */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span>added {format(new Date(idea.dateAdded), "MMM d, yyyy")}</span>
                <span>updated {formatDistanceToNow(new Date(idea.lastUpdated), { addSuffix: true })}</span>
              </div>

              {/* Inspiration links */}
              {idea.links.length > 0 && (
                <InspirationLinks links={idea.links} />
              )}

              {/* Read more */}
              <Link
                href={`/ideas/${idea.slug}`}
                className="mt-4 inline-block text-xs text-muted-foreground transition-colors hover:text-primary"
              >
                read more &rarr;
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
