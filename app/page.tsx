import { ScrollReveal } from "./components/scroll-reveal";

const projects = [
  {
    name: "stableflow",
    description:
      "Workflow orchestration engine. Deterministic execution graphs for complex async pipelines.",
    stack: ["typescript", "react", "hono"],
    status: "active",
  },
  {
    name: "permissions-engine",
    description:
      "Fine-grained authorization system. Policy-as-code with real-time evaluation at the edge.",
    stack: ["typescript", "zod", "postgres"],
    status: "active",
  },
  {
    name: "payment-engine",
    description:
      "Transaction processing backbone. Multi-provider orchestration with idempotent state machines.",
    stack: ["typescript", "postgres", "redis"],
    status: "shipped",
  },
];

const links = [
  { label: "github", href: "https://github.com/mvla" },
  { label: "x.com", href: "https://x.com/mvla" },
  { label: "email", href: "mailto:hello@mvla.dev" },
];

export default function Home() {
  return (
    <main className="relative mx-auto min-h-screen max-w-5xl px-6 sm:px-12">
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen flex-col justify-center">
        <div className="max-w-5xl">
          {/* Top accent line */}
          <div className="letterbox-accent line-animate mb-16 w-48" />

          <h1 className="title-animate text-5xl font-light uppercase tracking-[0.3em] text-text sm:text-7xl lg:text-8xl">
            mvla
          </h1>

          <div className="subtitle-animate mt-8 flex items-center gap-3">
            <span className="text-accent">&#9646;</span>
            <p className="text-sm tracking-wider text-text-dim sm:text-base">
              software engineer. building systems that outlast me.
            </p>
          </div>

          <p className="subtitle-animate mt-6 max-w-lg text-xs leading-relaxed tracking-wide text-muted">
            I design and build infrastructure, orchestration engines, and tools
            for developers who refuse to settle. Based in code. Rooted in craft.
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-0 flex flex-col items-center gap-2">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
            scroll
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-muted to-transparent" />
        </div>

        {/* Corner coordinates */}
        <div className="absolute right-0 top-8 text-[10px] tracking-widest text-border">
          <span className="text-muted">2026.03</span>
        </div>
      </section>

      <div className="letterbox" />

      {/* ═══ PHILOSOPHY ═══ */}
      <section className="py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ScrollReveal>
              <span className="section-num">01 ── philosophy</span>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <ScrollReveal delay={1}>
              <blockquote className="text-lg leading-relaxed tracking-wide text-text sm:text-xl lg:text-2xl">
                &ldquo;The best code doesn&apos;t announce itself. It disappears
                into the system — invisible, inevitable, load-bearing.&rdquo;
              </blockquote>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="mt-12 space-y-6 text-sm leading-relaxed text-text-dim">
                <p>
                  I don&apos;t build for the demo. I build for the moment six months
                  from now when someone inherits my code and everything just
                  makes sense.
                </p>
                <p>
                  Complexity is easy. Any engineer can make something complex.
                  The discipline is in reduction — stripping a system down to its
                  essential forces and letting those forces do the work.
                </p>
                <p>
                  I optimize for clarity, composability, and conviction. Every
                  abstraction earns its place or gets deleted. Every dependency
                  justifies its weight or gets replaced.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={3}>
              <div className="letterbox-accent mt-12 w-24" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="letterbox" />

      {/* ═══ SELECTED WORK ═══ */}
      <section className="py-32">
        <ScrollReveal>
          <span className="section-num">02 ── selected work</span>
        </ScrollReveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ScrollReveal key={project.name} delay={(i + 1) as 1 | 2 | 3}>
              <article className="project-card h-full p-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg tracking-wider text-text">
                    {project.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {project.status === "active" && (
                      <>
                        <div className="status-dot" />
                        <span className="text-[10px] uppercase tracking-widest text-accent">
                          {project.status}
                        </span>
                      </>
                    )}
                    {project.status === "shipped" && (
                      <span className="text-[10px] uppercase tracking-widest text-muted">
                        {project.status}
                      </span>
                    )}
                  </div>
                </div>

                <p className="mt-6 text-sm leading-relaxed text-text-dim">
                  {project.description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="border border-border px-3 py-1 text-[10px] uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <div className="letterbox" />

      {/* ═══ NOW ═══ */}
      <section className="py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ScrollReveal>
              <span className="section-num">03 ── now</span>
            </ScrollReveal>
            <ScrollReveal delay={1}>
              <p className="mt-4 text-xs text-muted">
                Last updated: March 2026
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-6">
            <ScrollReveal delay={1}>
              <div className="space-y-8">
                <NowItem
                  label="building"
                  value="orchestration systems & developer tools"
                />
                <NowItem
                  label="exploring"
                  value="edge computing patterns & local-first architectures"
                />
                <NowItem
                  label="reading"
                  value="designing data-intensive applications"
                />
                <NowItem
                  label="thinking about"
                  value="what comes after microservices"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <div className="letterbox" />

      {/* ═══ CONTACT ═══ */}
      <section className="py-32">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ScrollReveal>
              <span className="section-num">04 ── contact</span>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-6 lg:col-start-6">
            <ScrollReveal delay={1}>
              <p className="text-sm leading-relaxed text-text-dim">
                I&apos;m selective about what I work on. If you&apos;re building
                something ambitious and need someone who treats engineering as
                craft — let&apos;s talk.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="mt-12 flex flex-col gap-4">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel="noopener noreferrer"
                    className="link-hover group flex items-center justify-between border-b border-border py-3 text-sm tracking-wider"
                  >
                    <span>{link.label}</span>
                    <span className="text-border transition-colors group-hover:text-accent">
                      &#8599;
                    </span>
                  </a>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-12">
        <div className="letterbox-accent mb-12" />
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
            mvla &copy; {new Date().getFullYear()}
          </span>
          <span className="text-[10px] tracking-widest text-border">
            built with conviction
          </span>
        </div>
      </footer>
    </main>
  );
}

function NowItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="group flex flex-col gap-1 border-l border-border pl-6 transition-colors hover:border-accent">
      <span className="text-[10px] uppercase tracking-[0.2em] text-accent">
        {label}
      </span>
      <span className="text-sm text-text-dim transition-colors group-hover:text-text">
        {value}
      </span>
    </div>
  );
}
