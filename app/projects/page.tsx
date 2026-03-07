"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Star, CircleDot } from "lucide-react";

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

function timeAgo(date: string): string {
  const seconds = Math.floor(
    (Date.now() - new Date(date).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const langColor: Record<string, string> = {
  TypeScript: "bg-blue-400",
  JavaScript: "bg-yellow-400",
  Python: "bg-green-400",
  Rust: "bg-orange-400",
  Go: "bg-cyan-400",
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
              className="group border-t border-border py-4 transition-colors hover:bg-muted/20"
            >
              {/* Top row: name + status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    - {project.name}
                  </span>
                  <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {project.status}
                </span>
              </div>

              {/* Description */}
              <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-600">
                {project.description}
              </p>

              {/* Metadata row */}
              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground/70">
                {project.language && (
                  <span className="flex items-center gap-1">
                    <span className={`size-2 rounded-full ${langColor[project.language] ?? "bg-muted-foreground"}`} />
                    {project.language}
                  </span>
                )}
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
                    ? `pushed ${timeAgo(project.lastPush)}`
                    : "no recent pushes"}
                </span>
              </div>

              {/* Last commit message */}
              {project.lastCommit && (
                <p className="mt-2 truncate font-mono text-xs text-muted-foreground/50">
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
