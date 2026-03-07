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

    const repoNames = Object.keys(TRACKED_REPOS);

    // Fetch events + repo metadata in parallel
    const [eventsRes, ...repoResponses] = await Promise.all([
      fetch(
        `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
        { headers, next: { revalidate: 60 } }
      ),
      ...repoNames.map((name) =>
        fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${name}`, {
          headers,
          next: { revalidate: 300 },
        })
      ),
    ]);

    if (!eventsRes.ok) {
      return c.json({ error: "github api error", status: eventsRes.status }, 502);
    }

    const events: GitHubEvent[] = await eventsRes.json();

    // Parse repo metadata
    const repoMeta: Record<string, { stars: number; forks: number; language: string | null; openIssues: number; createdAt: string }> = {};
    for (let i = 0; i < repoNames.length; i++) {
      if (repoResponses[i].ok) {
        const repo = await repoResponses[i].json();
        repoMeta[repoNames[i]] = {
          stars: repo.stargazers_count ?? 0,
          forks: repo.forks_count ?? 0,
          language: repo.language ?? null,
          openIssues: repo.open_issues_count ?? 0,
          createdAt: repo.created_at ?? null,
        };
      }
    }

    const pushEvents = events.filter((e) => e.type === "PushEvent");

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const projects = Object.entries(TRACKED_REPOS).map(([name, meta]) => {
      const repoFullName = `${GITHUB_USERNAME}/${name}`;
      const repoPushEvents = pushEvents.filter(
        (e) => e.repo.name === repoFullName
      );
      const lastPush = repoPushEvents[0];

      const commitsThisWeek = repoPushEvents
        .filter((e) => new Date(e.created_at) >= weekAgo)
        .reduce((sum, e) => sum + (e.payload.commits?.length ?? 0), 0);

      const rm = repoMeta[name];

      return {
        name,
        description: meta.description,
        href: meta.href,
        status: meta.status,
        lastPush: lastPush?.created_at ?? null,
        lastCommit: lastPush?.payload.commits?.at(-1)?.message ?? null,
        commitsThisWeek,
        stars: rm?.stars ?? 0,
        forks: rm?.forks ?? 0,
        language: rm?.language ?? null,
        openIssues: rm?.openIssues ?? 0,
        createdAt: rm?.createdAt ?? null,
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
