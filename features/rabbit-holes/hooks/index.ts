"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useRabbitHoles(published?: boolean) {
  const params = published !== undefined ? `?published=${published}` : "";
  return useQuery({
    queryKey: ["rabbit-holes", published],
    queryFn: async () => {
      const res = await fetch(`/api/rabbit-holes${params}`);
      if (!res.ok) throw new Error("Failed to fetch rabbit holes");
      return res.json();
    },
  });
}

export function useTrackRabbitHoleView(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/rabbit-holes/${id}/view`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to track view");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rabbit-holes"] });
    },
  });
}
