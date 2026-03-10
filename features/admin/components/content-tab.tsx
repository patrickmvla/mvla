"use client";

import { Eye } from "lucide-react";

interface ContentItem {
  id: number;
  title: string;
  slug?: string;
  published: boolean;
  viewCount: number;
}

export function ContentTab({
  items,
  emptyMessage,
  onTogglePublished,
}: {
  items: ContentItem[];
  emptyMessage: string;
  onTogglePublished: (id: number, published: boolean) => void;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground/50">{emptyMessage}</p>;
  }

  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-t border-border py-4"
        >
          <div>
            <p className="text-sm text-primary">{item.title}</p>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {item.viewCount}
              </span>
              {item.slug && <span>/{item.slug}</span>}
            </div>
          </div>
          <button
            onClick={() => onTogglePublished(item.id, !item.published)}
            className={`cursor-pointer text-[11px] transition-colors ${
              item.published
                ? "text-primary hover:text-muted-foreground"
                : "text-muted-foreground/50 hover:text-primary"
            }`}
          >
            {item.published ? "published" : "draft"}
          </button>
        </div>
      ))}
    </div>
  );
}
