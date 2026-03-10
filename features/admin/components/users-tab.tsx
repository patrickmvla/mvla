"use client";

import { Ban } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { useAdminUsers } from "../hooks";
import type { AdminUser } from "../types";

export function UsersTab({ currentUserId }: { currentUserId: string }) {
  const { data: users = [] } = useAdminUsers();
  const queryClient = useQueryClient();

  async function handleBan(userId: string) {
    await authClient.admin.banUser({ userId, banReason: "unauthorized access" });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  async function handleUnban(userId: string) {
    await authClient.admin.unbanUser({ userId });
    queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground/50">no users yet</p>;
  }

  return (
    <div className="flex flex-col">
      {users.map((user: AdminUser) => (
        <div
          key={user.id}
          className="flex items-center justify-between border-t border-border py-4"
        >
          <div>
            <p className="text-sm text-primary">
              {user.username ?? user.name}
              {user.role === "admin" && (
                <span className="ml-2 text-[10px] text-muted-foreground">
                  admin
                </span>
              )}
              {user.banned && (
                <span className="ml-2 text-[10px] text-red-400">banned</span>
              )}
            </p>
            <p className="text-[11px] text-muted-foreground">{user.email}</p>
          </div>
          {user.id !== currentUserId && (
            <button
              onClick={() =>
                user.banned ? handleUnban(user.id) : handleBan(user.id)
              }
              className="flex cursor-pointer items-center gap-1 text-[11px] text-muted-foreground/50 transition-colors hover:text-red-400"
            >
              <Ban className="size-3" />
              {user.banned ? "unban" : "ban"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
