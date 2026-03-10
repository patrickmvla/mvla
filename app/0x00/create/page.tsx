"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Rabbit, FolderGit2 } from "lucide-react";
import { useAdminSession } from "@/features/admin/hooks";
import { CreateIdeaForm } from "@/features/admin/components/create-idea-form";
import { CreateRabbitHoleForm } from "@/features/admin/components/create-rabbit-hole-form";
import { CreateProjectForm } from "@/features/admin/components/create-project-form";

type Tab = "idea" | "rabbit-hole" | "project";

export default function CreatePage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("idea");
  const { data: session, isLoading } = useAdminSession();

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

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "idea", label: "idea", icon: <FileText className="size-3" /> },
    {
      id: "rabbit-hole",
      label: "rabbit hole",
      icon: <Rabbit className="size-3" />,
    },
    {
      id: "project",
      label: "project",
      icon: <FolderGit2 className="size-3" />,
    },
  ];

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col p-6 sm:p-10">
      <header className="mb-8">
        <Link
          href="/0x00"
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground/50 transition-colors hover:text-primary mb-4"
        >
          <ArrowLeft className="size-3" />
          back to 0x00
        </Link>
        <h1 className="text-sm font-medium text-primary">create</h1>
        <p className="text-[11px] text-muted-foreground">
          add new content to the site
        </p>
      </header>

      {/* tabs */}
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

      {tab === "idea" && <CreateIdeaForm />}
      {tab === "rabbit-hole" && <CreateRabbitHoleForm />}
      {tab === "project" && <CreateProjectForm />}
    </div>
  );
}
