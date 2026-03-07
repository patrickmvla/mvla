import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PulseBar } from "./components/pulse-bar";
import { GitHubStats } from "./components/github-stats";

const links = [
  { label: "github", href: "https://github.com/patrickmvla" },
  { label: "x", href: "https://x.com/1gkohi" },
  { label: "email", href: "mailto:mvlapatrick@gmail.com" },
];

export default function Home() {
  return (
    <div className="mx-auto flex h-screen max-w-2xl flex-col justify-between p-6 sm:p-10">
      {/* ── Header ── */}
      <header>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium tracking-tight text-primary">
            patrick mvula
          </h1>
          <nav className="flex items-center gap-4">
            <Link
              href="/ideas"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              ideas
            </Link>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              projects
            </Link>
            <Link
              href="/rabbit-holes"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              rabbit holes
            </Link>
          </nav>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          software engineer. can&apos;t decide if i should build or read — shipping slop while i figure it out.
        </p>
      </header>

      {/* ── Middle ── */}
      <div className="flex flex-col gap-6">
        <Separator />

        {/* Projects pulse bar */}
        <div>
          <Link
            href="/projects"
            className="text-[11px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
          >
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
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            activity
          </span>
          <div className="mt-3">
            <GitHubStats />
          </div>
        </div>

        <Separator />
      </div>

      {/* ── Footer ── */}
      <footer className="flex items-center justify-between">
        <div className="flex items-center gap-6">
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
