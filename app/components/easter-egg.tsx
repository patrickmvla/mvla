"use client";

import { useEffect } from "react";

export function EasterEgg() {
  useEffect(() => {
    const styles = [
      "color: #c9a84c",
      "font-size: 14px",
      "font-family: monospace",
      "padding: 8px 0",
    ].join(";");

    const border = [
      "color: #555",
      "font-size: 11px",
      "font-family: monospace",
    ].join(";");

    console.log("%c┌─────────────────────────────────────┐", border);
    console.log("%c  you're looking at the source.", styles);
    console.log("%c  good. that means you think like me.", styles);
    console.log("%c  — mvla", styles);
    console.log("%c└─────────────────────────────────────┘", border);
  }, []);

  return null;
}
