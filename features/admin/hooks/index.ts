"use client";

import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import type { AdminUser, AdminIdea, AdminRabbitHole } from "../types";

export function useAdminSession() {
  return useQuery({
    queryKey: ["admin", "session"],
    queryFn: async () => {
      const res = await authClient.getSession();
      if (!res.data || res.data.user.role !== "admin") return null;
      return res.data as unknown as { user: AdminUser };
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const res = await authClient.admin.listUsers({ query: { limit: 100 } });
      return (res.data?.users ?? []) as unknown as AdminUser[];
    },
  });
}

export function useAdminIdeas() {
  return useQuery<AdminIdea[]>({
    queryKey: ["admin", "ideas"],
    queryFn: async () => {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      return data.ideas ?? [];
    },
  });
}

export function useAdminRabbitHoles() {
  return useQuery<AdminRabbitHole[]>({
    queryKey: ["admin", "rabbit-holes"],
    queryFn: async () => {
      const res = await fetch("/api/rabbit-holes");
      const data = await res.json();
      return data.rabbitHoles ?? [];
    },
  });
}
