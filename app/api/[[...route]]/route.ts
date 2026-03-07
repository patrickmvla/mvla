import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

const GITHUB_USERNAME = "patrickmvla";

const TRACKED_REPOS: Record<string, { status: "active" | "shipped"; href: string; description: string }> = {
  hachi: { status: "active", href: "https://hachii.vercel.app/", description: "visual platform for building RAG systems" },
  stableflow: { status: "active", href: "https://github.com/patrickmvla/stableflow", description: "workflow orchestration engine" },
  "permissions-engine": { status: "active", href: "https://github.com/patrickmvla/permissions-engine", description: "fine-grained authorization system" },
  "payment-engine": { status: "shipped", href: "https://github.com/patrickmvla/payment-engine", description: "transaction processing backbone" },
};

interface GitHubEvent {
  type: string;
  repo: { name: string };
  created_at: string;
  payload: {
    commits?: { message: string }[];
  };
}

app.get("/health", (c) => {
  return c.json({
    status: "alive",
    timestamp: new Date().toISOString(),
  });
});

app.get("/activity", async (c) => {
  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "mvla-site",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
      { headers, next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return c.json({ error: "github api error", status: res.status }, 502);
    }

    const events: GitHubEvent[] = await res.json();

    const pushEvents = events.filter((e) => e.type === "PushEvent");

    const projects = Object.entries(TRACKED_REPOS).map(([name, meta]) => {
      const lastPush = pushEvents.find(
        (e) => e.repo.name === `${GITHUB_USERNAME}/${name}`
      );

      return {
        name,
        description: meta.description,
        href: meta.href,
        status: meta.status,
        lastPush: lastPush?.created_at ?? null,
        lastCommit: lastPush?.payload.commits?.at(-1)?.message ?? null,
      };
    });

    return c.json({ projects, fetched: new Date().toISOString() });
  } catch {
    return c.json({ error: "failed to fetch activity" }, 500);
  }
});

app.get("/stats", async (c) => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "User-Agent": "mvla-site",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    // GraphQL query for contribution data
    const query = `
      query {
        user(login: "${GITHUB_USERNAME}") {
          contributionsCollection {
            totalCommitContributions
            restrictedContributionsCount
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER) {
            totalCount
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers,
      body: JSON.stringify({ query }),
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return c.json({ error: "github graphql error", status: res.status }, 502);
    }

    const data = await res.json();
    const user = data.data.user;
    const calendar = user.contributionsCollection.contributionCalendar;
    const totalCommits =
      user.contributionsCollection.totalCommitContributions +
      user.contributionsCollection.restrictedContributionsCount;

    // Calculate current streak
    const allDays = calendar.weeks
      .flatMap((w: { contributionDays: { contributionCount: number; date: string }[] }) => w.contributionDays)
      .reverse();

    let streak = 0;
    // Skip today if no contributions yet (day isn't over)
    const startIndex = allDays[0]?.contributionCount === 0 ? 1 : 0;
    for (let i = startIndex; i < allDays.length; i++) {
      if (allDays[i].contributionCount > 0) {
        streak++;
      } else {
        break;
      }
    }

    // Get last 52 weeks of contribution data for the graph
    const weeks = calendar.weeks.slice(-52).map(
      (w: { contributionDays: { contributionCount: number; date: string }[] }) =>
        w.contributionDays.map((d) => ({
          count: d.contributionCount,
          date: d.date,
        }))
    );

    // Commits this week — sum the last (current) week's contribution days
    const currentWeek = calendar.weeks.at(-1)?.contributionDays ?? [];
    const commitsThisWeek = currentWeek.reduce(
      (sum: number, d: { contributionCount: number }) => sum + d.contributionCount,
      0
    );

    return c.json({
      totalContributions: calendar.totalContributions,
      totalCommits,
      repos: user.repositories.totalCount,
      streak,
      commitsThisWeek,
      weeks,
    });
  } catch {
    return c.json({ error: "failed to fetch stats" }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
