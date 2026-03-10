"use client";

import { useQuery } from "@tanstack/react-query";

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

interface Stats {
  totalContributions: number;
  totalCommits: number;
  repos: number;
  streak: number;
  commitsThisWeek: number;
  weeks: { count: number; date: string }[][];
}

export function useActivity() {
  return useQuery<{ projects: Project[]; fetched: string }>({
    queryKey: ["github", "activity"],
    queryFn: async () => {
      const res = await fetch("/api/github/activity");
      if (!res.ok) throw new Error("Failed to fetch activity");
      return res.json();
    },
    refetchInterval: 60_000,
  });
}

export function useStats() {
  return useQuery<Stats>({
    queryKey: ["github", "stats"],
    queryFn: async () => {
      const res = await fetch("/api/github/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
  });
}
