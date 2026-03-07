import Link from "next/link";

interface RabbitHole {
  title: string;
  description: string;
  category: "paper" | "repo" | "book" | "talk" | "tool" | "concept";
  url?: string;
  repo?: string;
  status: "queued" | "exploring" | "absorbed";
  notes?: string;
}

const holes: RabbitHole[] = [
  {
    title: "database internals",
    description: "alex petrov — deep dive into storage engines, B-trees, LSM-trees, distributed systems primitives. understanding databases at the metal level.",
    category: "book",
    status: "exploring",
    notes: "starting from the bottom — how data actually hits disk.",
  },
  {
    title: "opencode",
    description: "terminal-native AI coding agent. reading through the entire codebase to understand how it's architected.",
    category: "repo",
    status: "exploring",
    repo: "https://github.com/anomalyco/opencode",
    notes: "obsessed with how they structured this.",
  },
];

const statusColor: Record<RabbitHole["status"], string> = {
  queued: "bg-muted-foreground",
  exploring: "bg-amber-500",
  absorbed: "bg-emerald-500",
};

const categoryLabel: Record<RabbitHole["category"], string> = {
  paper: "paper",
  repo: "repo",
  book: "book",
  talk: "talk",
  tool: "tool",
  concept: "concept",
};

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
          software, papers, repos, and concepts i&apos;m nerding out on.
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
            const inner = (
              <div className="border-t border-border py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-block size-1.5 rounded-full ${statusColor[hole.status]}`}
                  />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {hole.status}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground/40">
                    {categoryLabel[hole.category]}
                  </span>
                </div>
                <h2 className="mt-1.5 text-sm font-medium text-primary">
                  {hole.title}
                </h2>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {hole.description}
                </p>
                {hole.repo && (
                  <a
                    href={hole.repo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 inline-block text-[11px] text-muted-foreground/50 transition-colors hover:text-primary"
                  >
                    {hole.repo.replace("https://github.com/", "")}
                  </a>
                )}
                {hole.notes && (
                  <p className="mt-1.5 text-xs italic text-muted-foreground/60">
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
                className="transition-colors hover:bg-muted/30"
              >
                {inner}
              </a>
            ) : (
              <div key={hole.title}>{inner}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
