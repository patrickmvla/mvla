import "dotenv/config";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE!,
  authToken: process.env.TURSO_TOKEN,
});

const db = drizzle({ client, schema });

async function seed() {
  console.log("seeding ideas...");

  const [idea] = await db
    .insert(schema.ideas)
    .values({
      slug: "context-engineering",
      title: "context engineering for end users",
      category: "ai engineering",
      description:
        "as models get smarter and context windows get longer, it's become easy to just flood the window — dump in MCP servers, skills, copy-pasted markdown from docs — and hope the model figures it out. terminal-based agents like claude code, opencode, and codex are especially prone to this — they're ingesting entire codebases, tool outputs, and conversation history with no optimization. but more context doesn't mean better context. nobody's helping end users be intentional about what they feed the model. this is the missing layer — a tool that audits, scores, trims, and optimizes your context before it hits the window.",
      content: `## the problem

context windows are the most valuable real estate in AI and everyone's wasting it. karpathy framed it best: "the LLM is a CPU, the context window is RAM, and you are the operating system responsible for loading exactly the right information for each task."

the ecosystem has given us incredible context sources — MCP has 5,800+ servers and 97M+ monthly SDK downloads, documentation sites serve /llms.txt files that cut tokens by 10x vs raw HTML, and every docs page now has a "copy as markdown" button. but the assembly layer is completely missing.

users copy-paste entire docs pages when 20% is relevant. they connect 8 MCP servers when the task needs 2. they dump full codebases into context with zero prioritization. anthropic's own research confirms models suffer "context rot" — diminishing returns as context grows. there's even a Tool Filtering Working Group inside MCP governance specifically because tool flooding is the #1 pain point.

terminal-based agents like claude code, codex, and opencode have started addressing this with features like auto-compaction — summarizing older context when the window fills up. but compaction is a band-aid, not a strategy. it kicks in after the damage is done, and it's invisible to the user. end users with little knowledge of context management still have no way to understand what's being kept, what's being dropped, or whether their context was any good in the first place.

## what exists today

the tooling that exists is all developer/infrastructure-facing. nothing targets end users.

- **token visualizer** — analyze token usage in prompts, multi-model support. dev tool.
- **tokenlint** — VS Code extension for real-time token counting. dev tool.
- **context engineering toolkit** — compression, prioritization, benchmarking library. dev tool.
- **OpenCE** — pluggable meta-framework for context engineering systems. dev tool.
- **context7** — MCP server that serves up-to-date docs to coding agents. solves formatting, not selection.
- **TOON** — token-optimized serialization format, 18-40% reduction. serialization layer.

the big players handle it internally — claude code uses deferred tool loading and auto-compaction, manus optimizes KV-cache hit rates for 10x cost reduction and uses the filesystem as extended memory. but none of this is exposed to the user.

## the approach

a context engineering assistant that sits between the user and the model. not a developer library — a product that helps anyone using AI be intentional about what they feed it.

- **context audit** — paste what you're about to send and see a breakdown — token count, information density, redundancy, irrelevant sections highlighted.
- **context score** — a simple 1-10 metric users can understand. "your context is a 4/10 for this task, here's why."
- **smart trimming** — same information at 80% fewer tokens with 95% of the useful content.
- **MCP advisor** — "you have 8 MCP servers connected, for this task you only need these 2, disable the rest to reduce noise."
- **format optimizer** — takes raw paste and restructures it into what models actually consume well.
- **learning loop** — tracks what context strategies led to good outputs. users build intuition over time.

## extension for AI builders

the same core extends into developer tooling:

- context strategy benchmarking across models
- A/B testing different context assemblies
- SDK for automated context optimization in pipelines
- integration with MCP's upcoming tool filtering spec

## principles from the research

anthropic's engineering team says the goal is finding "the smallest set of high-signal tokens that maximize the likelihood of the desired outcome." key patterns:

- **minimal high-signal tokens** — less is more
- **context rot is real** — models lose focus as context grows
- **just-in-time retrieval** — don't preload everything, fetch when needed
- **attention manipulation** — recite objectives at end of context
- **sub-agent architecture** — farm out tasks to keep context windows clean
- **error preservation** — keep mistakes visible so models don't repeat them

## why now

MCP is under the linux foundation with 97M+ monthly downloads. llms.txt is becoming a standard. every major AI company has adopted tool use. the context sources are there — but the assembly intelligence is completely missing. everyone's building better retrieval. nobody's building better assembly. this is the gap.`,
      tags: JSON.stringify([
        "typescript",
        "ai",
        "context engineering",
        "mcp",
      ]),
      stage: "researching",
      complexity: "ambitious",
      dateAdded: "2026-03-09",
      lastUpdated: "2026-03-09T17:00:00Z",
      published: true,
    })
    .returning();

  console.log(`  created idea: ${idea.slug} (id: ${idea.id})`);

  const links = [
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
  ];

  for (const link of links) {
    await db.insert(schema.inspirationLinks).values({
      ideaId: idea.id,
      label: link.label,
      href: link.href,
    });
  }
  console.log(`  added ${links.length} inspiration links`);

  console.log("\nseeding rabbit holes...");

  await db.insert(schema.rabbitHoles).values([
    {
      title: "database internals",
      description:
        "alex petrov — deep dive into storage engines, B-trees, LSM-trees, distributed systems primitives. understanding databases at the metal level.",
      category: "book",
      tags: JSON.stringify(["databases", "distributed systems", "storage engines"]),
      status: "exploring",
      notes: "starting from the bottom — how data actually hits disk.",
      published: true,
    },
    {
      title: "opencode",
      description:
        "terminal-native AI coding agent. reading through the entire codebase to understand how it's architected.",
      category: "repo",
      tags: JSON.stringify(["ai", "cli", "agents", "typescript"]),
      status: "exploring",
      repo: "https://github.com/anomalyco/opencode",
      notes: "obsessed with how they structured this.",
      published: true,
    },
  ]);

  console.log("  added 2 rabbit holes");
  console.log("\ndone!");
}

seed().catch(console.error);
