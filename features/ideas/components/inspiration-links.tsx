"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
export function InspirationLinks({ links }: { links: { label: string; href: string }[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? links : links.slice(0, 3);
  const remaining = links.length - 3;

  return (
    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
      {visible.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex items-center gap-0.5 text-[10px] text-muted-foreground/80 transition-colors hover:text-primary"
        >
          {link.label}
          <ArrowUpRight className="size-2.5 opacity-0 transition-opacity group-hover/link:opacity-100" />
        </a>
      ))}
      {!expanded && remaining > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="text-[10px] text-muted-foreground/70 transition-colors hover:text-primary"
        >
          +{remaining} more
        </button>
      )}
    </div>
  );
}
