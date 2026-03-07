import { Separator } from "@/components/ui/separator";
import { ArrowUpRight } from "lucide-react";
import { PulseBar } from "./components/pulse-bar";
import { GitHubStats } from "./components/github-stats";

const now = [
  { label: "building", value: "orchestration systems" },
  { label: "reading", value: "designing data-intensive apps" },
  { label: "exploring", value: "local-first architectures" },
];

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
        <h1 className="text-xl font-medium tracking-tight text-primary">
          mvla
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          software engineer. i build systems that outlast me.
        </p>
      </header>

      {/* ── Middle ── */}
      <div className="flex flex-col gap-6">
        <Separator />

        {/* Projects pulse bar */}
        <div>
          <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
            projects
          </span>
          <div className="mt-3">
            <PulseBar />
          </div>
        </div>

        <Separator />

        {/* Stats + Now side by side */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-[1.2fr_0.8fr]">
          {/* GitHub Stats + Graph */}
          <div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              activity
            </span>
            <div className="mt-3">
              <GitHubStats />
            </div>
          </div>

          {/* Now */}
          <div>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              now
            </span>
            <div className="mt-4 flex flex-col gap-3">
              {now.map((item) => (
                <div key={item.label}>
                  <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </span>
                  <p className="text-sm text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
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
