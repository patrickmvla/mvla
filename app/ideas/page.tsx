import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface Idea {
  title: string;
  description: string;
  tags: string[];
  status: "thinking" | "researching" | "next up";
}

const ideas: Idea[] = [
  // {
  //   title: "project name",
  //   description: "one-liner about what it does and why it matters.",
  //   tags: ["typescript", "postgres"],
  //   status: "thinking",
  // },
];

const statusColor: Record<Idea["status"], string> = {
  thinking: "bg-muted-foreground",
  researching: "bg-amber-500",
  "next up": "bg-emerald-500",
};

export default function Ideas() {
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
          things i want to build. no guarantees, no timelines.
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
              key={idea.title}
              className="border-t border-border py-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block size-1.5 rounded-full ${statusColor[idea.status]}`}
                />
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {idea.status}
                </span>
              </div>
              <h2 className="mt-1.5 text-sm font-medium text-primary">
                {idea.title}
              </h2>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {idea.description}
              </p>
              <div className="mt-2 flex gap-2">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest text-muted-foreground/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
