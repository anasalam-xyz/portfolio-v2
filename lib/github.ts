/**
 * GitHub activity provider (Server-side only).
 * Fetches contributionsCollection via GitHub GraphQL API for the last 120 days.
 * Includes a realistic fallback snapshot to ensure a clean render when no token is present.
 */

export interface ActivityDay {
  date: string; // "YYYY-MM-DD"
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
  weekday: number; // 0 = Sunday, 6 = Saturday
  isPlaceholder?: boolean;
}

export interface ActivityWeek {
  days: ActivityDay[];
}

export interface GitHubActivity {
  totalContributions: number;
  weeks: ActivityWeek[];
  username: string;
  isFallback: boolean;
}

export function countToLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

/**
 * Generates an array of UTC midnight Date objects for the last N days up to today.
 */
export function lastNDaysUTC(n: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(todayUTC.getTime() - i * 86400000);
    dates.push(d);
  }
  return dates;
}

export function formatDateUTC(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Organizes days into 7-day columns (Sunday-Saturday) aligned to the starting weekday.
 */
export function buildAlignedWeeks(days: ActivityDay[]): ActivityWeek[] {
  if (days.length === 0) return [];

  const paddedDays: ActivityDay[] = [];
  const firstDay = days[0];
  const firstWeekday = firstDay.weekday; // 0 = Sunday

  // Pad the first column if the start date isn't Sunday
  for (let i = 0; i < firstWeekday; i++) {
    paddedDays.push({
      date: `pad-start-${i}`,
      count: 0,
      level: 0,
      weekday: i,
      isPlaceholder: true,
    });
  }

  // Push actual days
  paddedDays.push(...days);

  // Pad the last column to 7 days
  const remaining = paddedDays.length % 7;
  if (remaining !== 0) {
    const toAdd = 7 - remaining;
    for (let i = 0; i < toAdd; i++) {
      paddedDays.push({
        date: `pad-end-${i}`,
        count: 0,
        level: 0,
        weekday: (paddedDays.length % 7),
        isPlaceholder: true,
      });
    }
  }

  // Chunk into 7-day weeks
  const weeks: ActivityWeek[] = [];
  for (let i = 0; i < paddedDays.length; i += 7) {
    weeks.push({
      days: paddedDays.slice(i, i + 7),
    });
  }

  return weeks;
}

/**
 * Deterministic fallback snapshot for GitHub activity over the last 120 days.
 */
function getGitHubFallbackSnapshot(username: string): GitHubActivity {
  const dates = lastNDaysUTC(120);

  // Realistic pattern: high consistency on weekdays, occasional rest days, peaks on feature pushes
  const seedCounts = [
    0, 2, 4, 3, 5, 2, 0, // W1
    1, 3, 2, 4, 6, 1, 0, // W2
    0, 4, 5, 3, 2, 8, 1, // W3
    2, 3, 1, 4, 7, 3, 0, // W4
    0, 2, 3, 5, 4, 2, 0, // W5
    1, 4, 6, 2, 3, 5, 1, // W6
    0, 3, 4, 2, 5, 2, 0, // W7
    2, 5, 3, 4, 6, 1, 0, // W8
    0, 2, 4, 3, 2, 4, 0, // W9
    1, 3, 5, 7, 4, 2, 1, // W10
    0, 4, 2, 3, 6, 3, 0, // W11
    2, 3, 4, 5, 2, 1, 0, // W12
    0, 5, 3, 2, 4, 6, 1, // W13
    1, 2, 4, 3, 5, 2, 0, // W14
    0, 3, 6, 4, 2, 3, 1, // W15
    2, 4, 3, 5, 8, 2, 0, // W16
    0, 2, 5, 3, 4, 1, 0, // W17
    1, 3,                                // Remainder
  ];

  let total = 0;
  const days: ActivityDay[] = dates.map((date, idx) => {
    const rawCount = seedCounts[idx % seedCounts.length] ?? 0;
    total += rawCount;
    return {
      date: formatDateUTC(date),
      count: rawCount,
      level: countToLevel(rawCount),
      weekday: date.getUTCDay(),
    };
  });

  return {
    totalContributions: total,
    weeks: buildAlignedWeeks(days),
    username,
    isFallback: true,
  };
}

import { cacheLife } from "next/cache";

export async function getGitHubActivity(): Promise<GitHubActivity> {
  "use cache";
  cacheLife({ revalidate: 43200 });
  const username = process.env.GITHUB_USERNAME || "anasalam-xyz";
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (!token) {
    return getGitHubFallbackSnapshot(username);
  }

  try {
    const dates = lastNDaysUTC(120);
    const fromISO = dates[0].toISOString();
    const toISO = new Date().toISOString();

    const query = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  date
                  contributionCount
                  weekday
                }
              }
            }
          }
        }
      }
    `;

    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "portfolio-v2-activity",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        variables: { username, from: fromISO, to: toISO },
      }),
      next: { revalidate: 43200 }, // 12 hours
    });

    if (!res.ok) {
      return getGitHubFallbackSnapshot(username);
    }

    const json = await res.json();
    const calendar = json?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar || !calendar.weeks) {
      return getGitHubFallbackSnapshot(username);
    }

    // Flatten days from response
    const dayMap = new Map<string, number>();
    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        dayMap.set(day.date, day.contributionCount);
      }
    }

    // Build precisely the last 120 UTC days
    let computedTotal = 0;
    const days: ActivityDay[] = dates.map((date) => {
      const dateStr = formatDateUTC(date);
      const count = dayMap.get(dateStr) ?? 0;
      computedTotal += count;
      return {
        date: dateStr,
        count,
        level: countToLevel(count),
        weekday: date.getUTCDay(),
      };
    });

    return {
      totalContributions: computedTotal,
      weeks: buildAlignedWeeks(days),
      username,
      isFallback: false,
    };
  } catch {
    return getGitHubFallbackSnapshot(username);
  }
}
