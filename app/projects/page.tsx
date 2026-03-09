"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Star, CircleDot, FileCode, FileJson, Terminal, Cog, Code } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  name: string;
  description: string;
  href: string;
  status: "active" | "shipped";
  lastPush: string | null;
  lastCommit: string | null;
  commitsThisWeek: number;
  stars: number;
  forks: number;
  language: string | null;
  openIssues: number;
  createdAt: string | null;
}

const langIcon: Record<string, React.ReactNode> = {
  TypeScript: <FileCode className="size-3" />,
  JavaScript: <FileJson className="size-3" />,
  Python: <Terminal className="size-3" />,
  Rust: <Cog className="size-3" />,
  Go: <Code className="size-3" />,
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    async function fetchActivity() {
      try {
        const res = await fetch("/api/activity");
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data.projects);
      } catch {
        // silent fail
      }
    }

    fetchActivity();
    const interval = setInterval(fetchActivity, 60_000);
    return () => clearInterval(interval);
  }, []);

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
          projects
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          exhibit a: what my sleep schedule refers to as &apos;the problem&apos;
        </p>
      </header>

      {/* Project rows */}
      {!projects ? (
        <div className="flex flex-col">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse border-t border-border" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {projects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-t border-border py-6 transition-colors hover:bg-muted/20"
            >
              {/* Status + language */}
              <div className="flex items-center gap-3">
                {project.language && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    {langIcon[project.language] ?? <Code className="size-3" />}
                    <span className="text-[10px] uppercase tracking-widest">
                      {project.language}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-muted-foreground/30">
                  /
                </span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {project.status}
                </span>
              </div>

              {/* Title */}
              <h2 className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
                {project.name}
                <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </h2>

              {/* Description */}
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Metadata row */}
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1 tabular-nums">
                  <Star className="size-3" />
                  {project.stars}
                </span>
                {project.openIssues > 0 && (
                  <span className="flex items-center gap-1 tabular-nums">
                    <CircleDot className="size-3" />
                    {project.openIssues} open
                  </span>
                )}
                <span className="tabular-nums">
                  {project.commitsThisWeek > 0
                    ? `${project.commitsThisWeek} commits this week`
                    : "no commits this week"}
                </span>
                <span>
                  {project.lastPush
                    ? `pushed ${formatDistanceToNow(new Date(project.lastPush), { addSuffix: true })}`
                    : "no recent pushes"}
                </span>
              </div>

              {/* Last commit message */}
              {project.lastCommit && (
                <p className="mt-2 truncate font-mono text-xs text-muted-foreground/70">
                  &quot;{project.lastCommit}&quot;
                </p>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
