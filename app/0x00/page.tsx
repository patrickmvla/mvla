"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Shield, Users, FileText, Rabbit, LogOut, PenLine, Plus } from "lucide-react";
import {
  useAdminSession,
  useAdminIdeas,
  useAdminRabbitHoles,
} from "@/features/admin/hooks";
import { StatCard } from "@/features/admin/components/stat-card";
import { UsersTab } from "@/features/admin/components/users-tab";
import { ContentTab } from "@/features/admin/components/content-tab";

type Tab = "overview" | "users" | "ideas" | "rabbit-holes";

export default function Mainframe() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const { data: session, isLoading } = useAdminSession();
  const { data: ideas = [] } = useAdminIdeas();
  const { data: rabbitHoles = [] } = useAdminRabbitHoles();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">
          verifying clearance...
        </p>
      </div>
    );
  }

  if (!session) {
    router.push("/");
    return null;
  }

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  function togglePublished(
    type: "ideas" | "rabbit-holes",
    id: number,
    published: boolean
  ) {
    // TODO: wire up PATCH endpoints
    void type;
    void id;
    void published;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "overview", icon: <Shield className="size-3" /> },
    { id: "users", label: "users", icon: <Users className="size-3" /> },
    { id: "ideas", label: "ideas", icon: <FileText className="size-3" /> },
    {
      id: "rabbit-holes",
      label: "rabbit holes",
      icon: <Rabbit className="size-3" />,
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col p-6 sm:p-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-medium text-primary">0x00</h1>
          <p className="text-[11px] text-muted-foreground">
            welcome back, {session.user.username ?? session.user.name}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex cursor-pointer items-center gap-1.5 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary"
        >
          <LogOut className="size-3" />
          sign out
        </button>
      </header>

      {/* Tabs */}
      <nav className="mb-8 flex gap-1 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 text-[11px] transition-colors ${
              tab === t.id
                ? "border-b border-primary text-primary"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </nav>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard label="ideas" value={ideas.length} />
            <StatCard label="rabbit holes" value={rabbitHoles.length} />
            <StatCard label="role" value={session.user.role ?? "—"} />
            <StatCard
              label="total views"
              value={
                ideas.reduce((s, i) => s + i.viewCount, 0) +
                rabbitHoles.reduce((s, r) => s + r.viewCount, 0)
              }
            />
          </div>
          <div className="flex gap-4">
            <Link
              href="/0x00/create"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary"
            >
              <Plus className="size-3" />
              create new
            </Link>
            <Link
              href="/0x00/drafts"
              className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary"
            >
              <PenLine className="size-3" />
              view drafts
            </Link>
          </div>
        </div>
      )}

      {/* Users */}
      {tab === "users" && <UsersTab currentUserId={session.user.id} />}

      {/* Ideas */}
      {tab === "ideas" && (
        <ContentTab
          items={ideas}
          emptyMessage="no ideas yet"
          onTogglePublished={(id, pub) => togglePublished("ideas", id, pub)}
        />
      )}

      {/* Rabbit Holes */}
      {tab === "rabbit-holes" && (
        <ContentTab
          items={rabbitHoles}
          emptyMessage="no rabbit holes yet"
          onTogglePublished={(id, pub) =>
            togglePublished("rabbit-holes", id, pub)
          }
        />
      )}
    </div>
  );
}
