import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowUpRight, Lightbulb, FolderGit2, Rabbit, Activity } from "lucide-react";
import { PulseBar } from "@/features/github/components/pulse-bar";
import { GitHubStats } from "@/features/github/components/github-stats";

const links = [
  { label: "github", href: "https://github.com/patrickmvla" },
  { label: "x", href: "https://x.com/1gkohi" },
  { label: "email", href: "mailto:mvlapatrick@gmail.com" },
];

export default function Home() {
  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-between gap-10 p-6 sm:p-10">
      {/* ── Header ── */}
      <header>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-xl font-medium tracking-tight text-primary">
            patrick mvula
          </h1>
          <nav className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/ideas"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Lightbulb className="size-3" />
              <span className="hidden sm:inline">ideas</span>
            </Link>
            <Link
              href="/projects"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <FolderGit2 className="size-3" />
              <span className="hidden sm:inline">projects</span>
            </Link>
            <Link
              href="/rabbit-holes"
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <Rabbit className="size-3" />
              <span className="hidden sm:inline">rabbit holes</span>
            </Link>
          </nav>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          software engineer. building or reading — either way, we shipping slop.
        </p>
      </header>

      {/* ── Middle ── */}
      <div className="flex flex-col gap-6">
        <Separator />

        {/* Projects pulse bar */}
        <div>
          <Link
            href="/projects"
            className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
            <FolderGit2 className="size-3" />
            projects
          </Link>
          <div className="mt-3">
            <PulseBar />
          </div>
          <Link
            href="/projects"
            className="mt-2 block text-xs text-muted-foreground/50 transition-colors hover:text-muted-foreground"
          >
            view all &rarr;
          </Link>
        </div>

        <Separator />

        {/* GitHub Stats + Graph */}
        <div>
          <span className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
            <Activity className="size-3" />
            activity
          </span>
          <div className="mt-3">
            <GitHubStats />
          </div>
        </div>

        <Separator />
      </div>

      {/* ── Footer ── */}
      <footer className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4 sm:gap-6">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="group flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
              <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground/50">
          no light mode.
        </span>
      </footer>
    </div>
  );
}
