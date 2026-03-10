"use client";

import { useStats } from "@/features/github/hooks";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function getIntensity(count: number): string {
  if (count === 0) return "bg-muted/30";
  if (count <= 2) return "bg-foreground/15";
  if (count <= 5) return "bg-foreground/30";
  if (count <= 9) return "bg-foreground/50";
  return "bg-foreground/80";
}

export function GitHubStats() {
  const { data: stats } = useStats();

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
      <div className="flex flex-wrap gap-x-8 gap-y-3">
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
