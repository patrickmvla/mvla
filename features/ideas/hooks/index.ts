"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useIdeas(published?: boolean) {
  const params = published !== undefined ? `?published=${published}` : "";
  return useQuery({
    queryKey: ["ideas", published],
    queryFn: async () => {
      const res = await fetch(`/api/ideas${params}`);
      if (!res.ok) throw new Error("Failed to fetch ideas");
      return res.json();
    },
  });
}

export function useIdea(slug: string) {
  return useQuery({
    queryKey: ["ideas", slug],
    queryFn: async () => {
      const res = await fetch(`/api/ideas/${slug}`);
      if (!res.ok) throw new Error("Failed to fetch idea");
      return res.json();
    },
  });
}

export function useTrackView(slug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/ideas/${slug}/view`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to track view");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ideas", slug] });
    },
  });
}
