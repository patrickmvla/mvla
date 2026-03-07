"use client";

import { useEffect } from "react";

export function EasterEgg() {
  useEffect(() => {
    const s = "color:#525252;font-family:monospace;font-size:12px;padding:4px 0";
    const h = "color:#e5e5e5;font-family:monospace;font-size:13px;padding:4px 0";

    console.log("%c┌────────────────────────────────────────┐", s);
    console.log("%c│  you're looking at the source.         │", h);
    console.log("%c│  good. that means you think like me.   │", h);
    console.log("%c│                                        │", s);
    console.log("%c│  — mvla                                │", h);
    console.log("%c└────────────────────────────────────────┘", s);
  }, []);

  return null;
}
