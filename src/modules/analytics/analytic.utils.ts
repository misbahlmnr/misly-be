import {
  eachDayOfInterval,
  eachMonthOfInterval,
  format,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";

export const ANALYTIC_RANGES = ["7d", "30d", "all"] as const;
export type AnalyticRange = (typeof ANALYTIC_RANGES)[number];

type VisitLike = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  referrer: string | null;
  visitedAt: Date;
};

const SOURCE_RULES: { test: RegExp; name: string; icon: string }[] = [
  { test: /instagram\.com/i, name: "Instagram", icon: "instagram" },
  { test: /whatsapp\.com|wa\.me/i, name: "WhatsApp", icon: "whatsapp" },
  { test: /google\./i, name: "Google Search", icon: "google" },
  { test: /facebook\.com|fb\.com|fb\.me/i, name: "Facebook", icon: "facebook" },
  { test: /(^|\.)t\.co$|(^|\.)x\.com$|twitter\.com/i, name: "X", icon: "x" },
  { test: /tiktok\.com/i, name: "TikTok", icon: "tiktok" },
  { test: /linkedin\.com/i, name: "LinkedIn", icon: "linkedin" },
  { test: /youtube\.com|youtu\.be/i, name: "YouTube", icon: "youtube" },
];

const DEVICE_ORDER = ["Mobile", "Desktop", "Tablet"] as const;

export function isAnalyticRange(value: string): value is AnalyticRange {
  return ANALYTIC_RANGES.includes(value as AnalyticRange);
}

export function normalizeAnalyticRange(value: string | undefined): string {
  if (!value) return "30d";
  if (value === "daily") return "7d";
  if (value === "weekly") return "30d";
  if (value === "monthly") return "all";
  return value;
}

export function comparisonLabel(range: AnalyticRange) {
  if (range === "7d") return "vs previous 7 days";
  if (range === "30d") return "vs previous 30 days";
  return "vs prior period";
}

export function resolveRangeWindow(range: AnalyticRange, now = new Date()) {
  if (range === "7d") {
    const start = startOfDay(subDays(now, 6));
    return {
      start,
      previousStart: startOfDay(subDays(now, 13)),
      end: now,
      bucket: "day" as const,
    };
  }

  if (range === "30d") {
    const start = startOfDay(subDays(now, 29));
    return {
      start,
      previousStart: startOfDay(subDays(now, 59)),
      end: now,
      bucket: "day" as const,
    };
  }

  const start = startOfMonth(subMonths(now, 11));
  return {
    start,
    previousStart: startOfMonth(subMonths(now, 23)),
    end: now,
    bucket: "month" as const,
  };
}

export function percentChange(current: number, previous: number) {
  if (previous === 0) return 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function countUniqueVisitors(visits: Pick<VisitLike, "id" | "ipAddress">[]) {
  return new Set(
    visits.map((visit) => visit.ipAddress ?? `anon:${visit.id}`),
  ).size;
}

export function parseDevice(userAgent: string | null) {
  if (!userAgent) return { name: "Desktop", icon: "desktop" };
  const ua = userAgent.toLowerCase();

  if (/ipad|tablet|playbook|silk|(android(?!.*mobile))/.test(ua)) {
    return { name: "Tablet", icon: "tablet" };
  }

  if (
    /mobile|iphone|ipod|android|blackberry|opera mini|windows phone|iemobile/.test(
      ua,
    )
  ) {
    return { name: "Mobile", icon: "mobile" };
  }

  return { name: "Desktop", icon: "desktop" };
}

export function parseBrowser(userAgent: string | null) {
  if (!userAgent) return "Other";
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/opr\/|opera/i.test(userAgent)) return "Opera";
  if (/firefox|fxios/i.test(userAgent)) return "Firefox";
  if (/chrome|crios/i.test(userAgent) && !/edg/i.test(userAgent)) return "Chrome";
  if (/safari/i.test(userAgent) && !/chrome|crios|android/i.test(userAgent)) {
    return "Safari";
  }
  return "Other";
}

export function parseSource(referrer: string | null) {
  if (!referrer?.trim()) return { name: "Direct", icon: "direct" };

  let host = "";
  try {
    const href = /^(https?:)?\/\//i.test(referrer)
      ? referrer
      : `https://${referrer}`;
    host = new URL(href).hostname.replace(/^www\./i, "").toLowerCase();
  } catch {
    return { name: "Direct", icon: "direct" };
  }

  const rule = SOURCE_RULES.find((item) => item.test.test(host));
  if (rule) return { name: rule.name, icon: rule.icon };

  return { name: host, icon: "direct" };
}

export function buildSeries(
  visits: Pick<VisitLike, "visitedAt">[],
  window: ReturnType<typeof resolveRangeWindow>,
) {
  const counts = new Map<string, number>();

  for (const visit of visits) {
    const key = seriesKey(visit.visitedAt, window.bucket);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const dates =
    window.bucket === "day"
      ? eachDayOfInterval({
          start: window.start,
          end: startOfDay(window.end),
        })
      : eachMonthOfInterval({
          start: window.start,
          end: window.end,
        });

  return dates.map((date) => {
    const key = seriesKey(date, window.bucket);
    return { date: key, value: counts.get(key) ?? 0 };
  });
}

export function buildSources(visits: Pick<VisitLike, "referrer">[], total: number) {
  const counts = new Map<string, { clicks: number; icon: string }>();

  for (const visit of visits) {
    const source = parseSource(visit.referrer);
    const current = counts.get(source.name) ?? { clicks: 0, icon: source.icon };
    current.clicks += 1;
    counts.set(source.name, current);
  }

  return [...counts.entries()]
    .map(([name, item]) => ({
      name,
      icon: item.icon,
      share: toShare(item.clicks, total),
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 6);
}

export function buildDevices(visits: Pick<VisitLike, "userAgent">[], total: number) {
  const counts: Record<(typeof DEVICE_ORDER)[number], number> = {
    Mobile: 0,
    Desktop: 0,
    Tablet: 0,
  };

  for (const visit of visits) {
    const device = parseDevice(visit.userAgent);
    if (device.name in counts) {
      counts[device.name as keyof typeof counts] += 1;
    }
  }

  const items = DEVICE_ORDER.map((name) => ({
    name,
    icon: name.toLowerCase(),
    share: toShare(counts[name], total),
  }));
  const topShare = Math.max(...items.map((item) => item.share));

  return items.map((item) => ({
    ...item,
    featured: topShare > 0 && item.share === topShare,
  }));
}

export function buildBrowsers(visits: Pick<VisitLike, "userAgent">[], total: number) {
  const counts = new Map<string, number>();

  for (const visit of visits) {
    const browser = parseBrowser(visit.userAgent);
    counts.set(browser, (counts.get(browser) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([name, clicks]) => ({
      name,
      share: toShare(clicks, total),
    }))
    .sort((a, b) => b.share - a.share)
    .slice(0, 5);
}

function seriesKey(date: Date, bucket: "day" | "month") {
  if (bucket === "month") {
    return format(startOfMonth(date), "yyyy-MM-dd");
  }
  return format(date, "yyyy-MM-dd");
}

function toShare(count: number, total: number) {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}
