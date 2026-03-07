"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

interface Project {
  name: string;
  description: string;
  href: string;
  status: "active" | "shipped";
  lastPush: string | null;
  lastCommit: string | null;
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
        // silent fail — static fallback stays
      }
    }

    fetchActivity();
    const interval = setInterval(fetchActivity, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!projects) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse bg-muted/50" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header row */}
      <div className="mb-2 grid grid-cols-[1fr_auto_auto] gap-4 text-[10px] uppercase tracking-widest text-muted-foreground">
        <span>project</span>
        <span className="w-16 text-center">status</span>
        <span className="w-20 text-right">last push</span>
      </div>

      {/* Project rows */}
      {projects.map((project) => (
        <a
          key={project.name}
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-border py-2.5 transition-colors hover:bg-muted/30"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-sm text-primary">{project.name}</span>
              <ArrowUpRight className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            <p className="truncate text-xs text-muted-foreground">
              {project.lastCommit ?? project.description}
            </p>
          </div>

          <Badge
            variant={project.status === "active" ? "outline" : "secondary"}
            className="w-16 justify-center text-[10px]"
          >
            <span
              className={`mr-1 inline-block size-1.5 rounded-full ${
                project.status === "active"
                  ? "bg-emerald-500 animate-pulse"
                  : "bg-muted-foreground"
              }`}
            />
            {project.status}
          </Badge>

          <span className="w-20 text-right text-xs text-muted-foreground">
            {project.lastPush ? timeAgo(project.lastPush) : "—"}
          </span>
        </a>
      ))}
    </div>
  );
}
