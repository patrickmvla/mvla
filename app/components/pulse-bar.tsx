"use client";

import { useEffect, useState } from "react";

interface Project {
  name: string;
  description: string;
  status: "active" | "shipped";
  lastPush: string | null;
  commitsThisWeek: number;
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

export function PulseBar() {
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

  if (!projects) {
    return (
      <div className="flex flex-col gap-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-7 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header row */}
      <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>project</span>
        <span>last push</span>
      </div>

      {projects.map((project) => (
        <div
          key={project.name}
          className="flex items-center justify-between border-t border-border/50 py-2.5"
        >
          <div className="min-w-0">
            <span className="text-sm text-primary">{project.name}</span>
            <p className="truncate text-[11px] text-muted-foreground">
              {project.description}
            </p>
          </div>
          <span className="shrink-0 text-[11px] tabular-nums text-muted-foreground">
            {project.lastPush ? timeAgo(project.lastPush) : "—"}
          </span>
        </div>
      ))}
    </div>
  );
}
