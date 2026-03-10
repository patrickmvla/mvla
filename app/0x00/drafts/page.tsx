"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, FileText, Rabbit, Send } from "lucide-react";
import { useAdminSession } from "@/features/admin/hooks";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AdminIdea, AdminRabbitHole } from "@/features/admin/types";

export default function Drafts() {
  const router = useRouter();
  const { data: session, isLoading } = useAdminSession();
  const queryClient = useQueryClient();

  const { data: ideas = [] } = useQuery<AdminIdea[]>({
    queryKey: ["drafts", "ideas"],
    queryFn: async () => {
      const res = await fetch("/api/ideas?published=false");
      const data = await res.json();
      return data.ideas ?? [];
    },
    enabled: !!session,
  });

  const { data: rabbitHoles = [] } = useQuery<AdminRabbitHole[]>({
    queryKey: ["drafts", "rabbit-holes"],
    queryFn: async () => {
      const res = await fetch("/api/rabbit-holes?published=false");
      const data = await res.json();
      return data.rabbitHoles ?? [];
    },
    enabled: !!session,
  });

  const publishIdea = useMutation({
    mutationFn: async (id: number) => {
      // TODO: wire up PATCH endpoint
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", "ideas"] });
    },
  });

  const publishRabbitHole = useMutation({
    mutationFn: async (id: number) => {
      // TODO: wire up PATCH endpoint
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drafts", "rabbit-holes"] });
    },
  });

  useEffect(() => {
    if (!isLoading && !session) router.push("/");
  }, [isLoading, session, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          loading drafts...
        </p>
      </div>
    );
  }

  if (!session) return null;

  const totalDrafts = ideas.length + rabbitHoles.length;

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col p-6 sm:p-10">
      <header className="mb-8">
        <Link
          href="/0x00"
          className="text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          &larr; back to 0x00
        </Link>
        <h1 className="mt-4 text-xl font-medium tracking-tight text-primary">
          drafts
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {totalDrafts === 0
            ? "nothing in the oven."
            : `${totalDrafts} item${totalDrafts === 1 ? "" : "s"} waiting to ship.`}
        </p>
      </header>

      {/* Ideas drafts */}
      {ideas.length > 0 && (
        <section className="mb-10">
          <div className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            <FileText className="size-3" />
            ideas
          </div>
          <div className="flex flex-col">
            {ideas.map((idea) => (
              <div
                key={idea.id}
                className="flex items-center justify-between border-t border-border py-4"
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/ideas/${idea.slug}`}
                    className="text-sm text-primary transition-colors hover:text-muted-foreground"
                  >
                    {idea.title}
                  </Link>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" />
                      {idea.viewCount}
                    </span>
                    <span>/{idea.slug}</span>
                  </div>
                </div>
                <button
                  onClick={() => publishIdea.mutate(idea.id)}
                  disabled={publishIdea.isPending}
                  className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary disabled:opacity-50"
                >
                  <Send className="size-3" />
                  publish
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Rabbit holes drafts */}
      {rabbitHoles.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">
            <Rabbit className="size-3" />
            rabbit holes
          </div>
          <div className="flex flex-col">
            {rabbitHoles.map((hole) => (
              <div
                key={hole.id}
                className="flex items-center justify-between border-t border-border py-4"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-primary">{hole.title}</p>
                  <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Eye className="size-3" />
                    {hole.viewCount}
                  </span>
                </div>
                <button
                  onClick={() => publishRabbitHole.mutate(hole.id)}
                  disabled={publishRabbitHole.isPending}
                  className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary disabled:opacity-50"
                >
                  <Send className="size-3" />
                  publish
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {totalDrafts === 0 && (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-muted-foreground/30">
            all caught up. go write something.
          </p>
        </div>
      )}
    </div>
  );
}
