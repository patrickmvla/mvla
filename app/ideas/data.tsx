import {
  ArrowUpRight,
  Lightbulb,
  FlaskConical,
  Compass,
  Hammer,
} from "lucide-react";

export interface InspirationLink {
  label: string;
  href: string;
}

export interface Idea {
  slug: string;
  title: string;
  category: string;
  description: string;
  tags: string[];
  stage: "thinking" | "researching" | "scoping" | "building";
  complexity: "small" | "medium" | "ambitious";
  dateAdded: string;
  lastUpdated: string;
  inspirationLinks: InspirationLink[];
  content: React.ReactNode;
}

export const stageColor: Record<Idea["stage"], string> = {
  thinking: "text-muted-foreground/50",
  researching: "text-muted-foreground/70",
  scoping: "text-muted-foreground/85",
  building: "text-muted-foreground",
};

export const stageIcon: Record<Idea["stage"], React.ReactNode> = {
  thinking: <Lightbulb className="size-3" />,
  researching: <FlaskConical className="size-3" />,
  scoping: <Compass className="size-3" />,
  building: <Hammer className="size-3" />,
};

export const complexityLabel: Record<Idea["complexity"], string> = {
  small: "small",
  medium: "medium",
  ambitious: "ambitious",
};

export const ideas: Idea[] = [
  {
    slug: "context-engineering",
    title: "context engineering for end users",
    category: "ai engineering",
    description:
      "as models get smarter and context windows get longer, it's become easy to just flood the window — dump in MCP servers, skills, copy-pasted markdown from docs — and hope the model figures it out. terminal-based agents like claude code, opencode, and codex are especially prone to this — they're ingesting entire codebases, tool outputs, and conversation history with no optimization. but more context doesn't mean better context. nobody's helping end users be intentional about what they feed the model. this is the missing layer — a tool that audits, scores, trims, and optimizes your context before it hits the window.",
    tags: ["typescript", "ai", "context engineering", "mcp"],
    stage: "researching",
    complexity: "ambitious",
    dateAdded: "2026-03-09",
    lastUpdated: "2026-03-09T17:00:00Z",
    inspirationLinks: [
      {
        label: "karpathy on context engineering",
        href: "https://x.com/karpathy/status/1937902205765607626",
      },
      {
        label: "anthropic — effective context engineering",
        href: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
      },
      {
        label: "manus — lessons from building agents",
        href: "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus",
      },
      {
        label: "llms.txt spec",
        href: "https://llmstxt.org/",
      },
      {
        label: "langchain — context engineering for agents",
        href: "https://blog.langchain.com/context-engineering-for-agents/",
      },
      {
        label: "context engineering toolkit",
        href: "https://github.com/jstilb/context-engineering-toolkit",
      },
    ],
    content: (
      <div className="flex flex-col gap-8">
        {/* The Problem */}
        <section>
          <h2 className="text-sm font-medium text-primary">the problem</h2>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              context windows are the most valuable real estate in AI and
              everyone&apos;s wasting it. karpathy framed it best: &quot;the LLM
              is a CPU, the context window is RAM, and you are the operating
              system responsible for loading exactly the right information for
              each task.&quot;
            </p>
            <p>
              the ecosystem has given us incredible context sources — MCP has
              5,800+ servers and 97M+ monthly SDK downloads, documentation sites
              serve /llms.txt files that cut tokens by 10x vs raw HTML, and
              every docs page now has a &quot;copy as markdown&quot; button. but
              the assembly layer is completely missing.
            </p>
            <p>
              users copy-paste entire docs pages when 20% is relevant. they
              connect 8 MCP servers when the task needs 2. they dump full
              codebases into context with zero prioritization. anthropic&apos;s
              own research confirms models suffer &quot;context rot&quot; —
              diminishing returns as context grows. there&apos;s even a Tool
              Filtering Working Group inside MCP governance specifically because
              tool flooding is the #1 pain point.
            </p>
            <p>
              terminal-based agents like claude code, codex, and opencode have
              started addressing this with features like auto-compaction —
              summarizing older context when the window fills up. but compaction
              is a band-aid, not a strategy. it kicks in after the damage is
              done, and it&apos;s invisible to the user. end users with little
              knowledge of context management still have no way to understand
              what&apos;s being kept, what&apos;s being dropped, or whether
              their context was any good in the first place. the tools optimize
              for survival (don&apos;t overflow the window) not for quality
              (send the right things in the right format).
            </p>
          </div>
        </section>

        {/* The Landscape */}
        <section>
          <h2 className="text-sm font-medium text-primary">
            what exists today
          </h2>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              the tooling that exists is all developer/infrastructure-facing.
              nothing targets end users.
            </p>
            <ul className="flex flex-col gap-1.5 pl-4">
              <li>
                <span className="text-primary/70">token visualizer</span> —
                analyze token usage in prompts, multi-model support. dev tool.
              </li>
              <li>
                <span className="text-primary/70">tokenlint</span> — VS Code
                extension for real-time token counting. dev tool.
              </li>
              <li>
                <span className="text-primary/70">
                  context engineering toolkit
                </span>{" "}
                — compression, prioritization, benchmarking library. dev tool.
              </li>
              <li>
                <span className="text-primary/70">OpenCE</span> — pluggable
                meta-framework for context engineering systems. dev tool.
              </li>
              <li>
                <span className="text-primary/70">context7</span> — MCP server
                that serves up-to-date docs to coding agents. solves formatting,
                not selection.
              </li>
              <li>
                <span className="text-primary/70">TOON</span> — token-optimized
                serialization format, 18-40% reduction. serialization layer.
              </li>
            </ul>
            <p>
              the big players handle it internally — claude code uses deferred
              tool loading and auto-compaction, manus optimizes KV-cache hit
              rates for 10x cost reduction and uses the filesystem as extended
              memory. but none of this is exposed to the user.
            </p>
          </div>
        </section>

        {/* The Approach */}
        <section>
          <h2 className="text-sm font-medium text-primary">the approach</h2>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              a context engineering assistant that sits between the user and the
              model. not a developer library — a product that helps anyone using
              AI be intentional about what they feed it.
            </p>
            <div className="mt-2 flex flex-col gap-3">
              <div>
                <span className="text-xs font-medium text-primary/70">
                  context audit
                </span>
                <p className="mt-0.5">
                  paste what you&apos;re about to send and see a breakdown —
                  token count, information density, redundancy, irrelevant
                  sections highlighted. &quot;you&apos;re about to spend 40k
                  tokens and 60% is noise.&quot;
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-primary/70">
                  context score
                </span>
                <p className="mt-0.5">
                  a simple 1-10 metric users can understand. &quot;your context
                  is a 4/10 for this task, here&apos;s why.&quot; makes the
                  invisible visible.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-primary/70">
                  smart trimming
                </span>
                <p className="mt-0.5">
                  same information at 80% fewer tokens with 95% of the useful
                  content. auto-converts raw HTML to clean markdown, strips
                  boilerplate, prioritizes sections.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-primary/70">
                  MCP advisor
                </span>
                <p className="mt-0.5">
                  &quot;you have 8 MCP servers connected, for this task you only
                  need these 2, disable the rest to reduce noise.&quot; fills
                  the gap that MCP&apos;s own Tool Filtering Working Group is
                  trying to solve at the protocol level.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-primary/70">
                  format optimizer
                </span>
                <p className="mt-0.5">
                  takes raw paste — HTML, code dumps, screenshots — and
                  restructures it into what models actually consume well.
                  markdown with clear headers, XML tags for claude, structured
                  sections.
                </p>
              </div>
              <div>
                <span className="text-xs font-medium text-primary/70">
                  learning loop
                </span>
                <p className="mt-0.5">
                  tracks what context strategies led to good outputs. &quot;last
                  time you included the full docs and got a worse answer than
                  when you sent just the API reference.&quot; users build
                  intuition over time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* For AI Builders */}
        <section>
          <h2 className="text-sm font-medium text-primary">
            extension for AI builders
          </h2>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>the same core extends into developer tooling:</p>
            <ul className="flex flex-col gap-1.5 pl-4">
              <li>
                context strategy benchmarking across models
              </li>
              <li>
                A/B testing different context assemblies
              </li>
              <li>
                SDK for automated context optimization in pipelines
              </li>
              <li>
                integration with MCP&apos;s upcoming tool filtering spec
              </li>
            </ul>
          </div>
        </section>

        {/* Key Principles */}
        <section>
          <h2 className="text-sm font-medium text-primary">
            principles from the research
          </h2>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              anthropic&apos;s engineering team says the goal is finding
              &quot;the smallest set of high-signal tokens that maximize the
              likelihood of the desired outcome.&quot; key patterns from
              production systems:
            </p>
            <ul className="flex flex-col gap-1.5 pl-4">
              <li>
                <span className="text-primary/70">minimal high-signal tokens</span>{" "}
                — less is more, smallest set that gets the job done
              </li>
              <li>
                <span className="text-primary/70">context rot is real</span> —
                models lose focus as context grows
              </li>
              <li>
                <span className="text-primary/70">just-in-time retrieval</span>{" "}
                — don&apos;t preload everything, fetch when needed
              </li>
              <li>
                <span className="text-primary/70">
                  attention manipulation
                </span>{" "}
                — recite objectives at end of context to combat &quot;lost in
                the middle&quot;
              </li>
              <li>
                <span className="text-primary/70">
                  sub-agent architecture
                </span>{" "}
                — farm out tasks to keep context windows clean
              </li>
              <li>
                <span className="text-primary/70">error preservation</span> —
                keep mistakes visible so models don&apos;t repeat them
              </li>
            </ul>
          </div>
        </section>

        {/* Why Now */}
        <section>
          <h2 className="text-sm font-medium text-primary">why now</h2>
          <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground">
            <p>
              MCP is under the linux foundation with 97M+ monthly downloads.
              llms.txt is becoming a standard. every major AI company has
              adopted tool use. the context sources are there — but the
              assembly intelligence is completely missing. everyone&apos;s
              building better retrieval. nobody&apos;s building better assembly.
              this is the gap.
            </p>
          </div>
        </section>
      </div>
    ),
  },
];
