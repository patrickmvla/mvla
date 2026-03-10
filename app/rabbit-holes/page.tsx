import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { rabbitHoles as rabbitHolesTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { format } from "date-fns";
import {
  categoryIcon,
  type RabbitHoleCategory,
} from "@/features/rabbit-holes/data";
import { PlateContent } from "@/features/shared/components/plate-content";

export const dynamic = "force-dynamic";

function parseTags(tags: unknown): string[] {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === "string") {
    try { return JSON.parse(tags); } catch { return []; }
  }
  return [];
}

function splitNotes(notes: string): { embeds: string | null; text: string | null } {
  try {
    const parsed = JSON.parse(notes);
    if (!Array.isArray(parsed)) return { embeds: null, text: notes };

    const embedNodes = parsed.filter((n: { type?: string }) => n.type === "media_embed");
    const textNodes = parsed.filter((n: { type?: string }) => n.type !== "media_embed");

    return {
      embeds: embedNodes.length > 0 ? JSON.stringify(embedNodes) : null,
      text: textNodes.length > 0 ? JSON.stringify(textNodes) : null,
    };
  } catch {
    return { embeds: null, text: notes };
  }
}

export default async function RabbitHoles() {
  const holes = await db
    .select()
    .from(rabbitHolesTable)
    .where(eq(rabbitHolesTable.published, true))
    .orderBy(desc(rabbitHolesTable.dateAdded), desc(rabbitHolesTable.id));

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
          rabbit holes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          things i fell into and didn&apos;t come back from.
        </p>
      </header>

      {/* List */}
      {holes.length === 0 ? (
        <p className="text-sm text-muted-foreground/50">
          nothing here yet. digging.
        </p>
      ) : (
        <div className="flex flex-col">
          {holes.map((hole) => {
            const category = hole.category as RabbitHoleCategory;
            const { embeds, text: textNotes } = splitNotes(hole.notes);

            const content = (
              <div className="border-t border-border py-6">
                {/* Status + category */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {categoryIcon[category]}
                    <span className="text-[10px] uppercase tracking-widest">
                      {category}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/30">
                    /
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {hole.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground/30">
                    /
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {format(new Date(hole.dateAdded), "MMM d, yyyy")}
                  </span>
                </div>

                {/* Title */}
                <h2 className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                  {hole.title}
                  {(hole.url || hole.repo) && (
                    <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </h2>

                {/* Description */}
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {hole.description}
                </p>

                {/* Tags */}
                {parseTags(hole.tags).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {parseTags(hole.tags).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Embeds (YouTube etc.) */}
                {embeds && (
                  <div className="mt-3 max-w-sm">
                    <PlateContent content={embeds} />
                  </div>
                )}

                {/* Notes */}
                {textNotes && (
                  <div className="mt-3">
                    <PlateContent
                      content={textNotes}
                      className="text-xs text-muted-foreground/70"
                    />
                  </div>
                )}

                {/* Link */}
                {hole.url && (
                  <Link
                    href={hole.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 transition-colors hover:text-primary"
                  >
                    {hole.url.replace(/^https?:\/\/(www\.)?/, "")}
                    <ArrowUpRight className="size-2.5" />
                  </Link>
                )}

                {/* Repo link */}
                {hole.repo && (
                  <a
                    href={hole.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 transition-colors hover:text-primary"
                  >
                    {hole.repo.replace("https://github.com/", "")}
                    <ArrowUpRight className="size-2.5" />
                  </a>
                )}
              </div>
            );

            return (
              <div key={hole.id} className="group">
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
