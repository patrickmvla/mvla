import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { holes, categoryIcon } from "./data";

export default function RabbitHoles() {
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
            const content = (
              <div className="border-t border-border py-6">
                {/* Status + category */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {categoryIcon[hole.category]}
                    <span className="text-[10px] uppercase tracking-widest">
                      {hole.category}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground/30">
                    /
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {hole.status}
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
                {hole.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {hole.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-sm bg-muted px-1.5 py-0.5 text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
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

                {/* Notes */}
                {hole.notes && (
                  <p className="mt-2 text-xs italic text-muted-foreground/70">
                    &quot;{hole.notes}&quot;
                  </p>
                )}
              </div>
            );

            return hole.url ? (
              <a
                key={hole.title}
                href={hole.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group transition-colors hover:bg-muted/30"
              >
                {content}
              </a>
            ) : (
              <div key={hole.title} className="group">
                {content}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
