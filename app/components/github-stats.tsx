"use client";

import { useEffect, useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Stats {
  totalContributions: number;
  totalCommits: number;
  repos: number;
  streak: number;
  commitsThisWeek: number;
  weeks: { count: number; date: string }[][];
}

function getIntensity(count: number): string {
  if (count === 0) return "bg-muted/30";
  if (count <= 2) return "bg-foreground/15";
  if (count <= 5) return "bg-foreground/30";
  if (count <= 9) return "bg-foreground/50";
  return "bg-foreground/80";
}

export function GitHubStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="space-y-3">
        <div className="flex gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-8 w-20 animate-pulse bg-muted/30" />
          ))}
        </div>
        <div className="h-[88px] animate-pulse bg-muted/30" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats row */}
      <div className="flex gap-8">
        <Stat label="this week" value={stats.commitsThisWeek} />
        <Stat label="streak" value={`${stats.streak}d`} />
        <Stat label="contributions" value={stats.totalContributions} />
        <Stat label="repos" value={stats.repos} />
      </div>

      {/* Contribution graph */}
      <ScrollArea className="w-full">
        <div className="flex gap-[3px] pb-3">
          {stats.weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day) => (
                <div
                  key={day.date}
                  className={`size-[10px] ${getIntensity(day.count)}`}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <span className="text-lg font-medium text-primary">{value}</span>
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
