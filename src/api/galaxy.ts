import type { ContentItem, RubricItem } from "../types/content.ts";

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "https://bdutbevipdtnierfwixy.supabase.co";
const SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdXRiZXZpcGR0bmllcmZ3aXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTY3MDYsImV4cCI6MjA4NzQzMjcwNn0.Ko53PZWSGRSuK1jZ8--6vFbEvGSB36i7s_0CzqJQimY";
const PROXY_URL = `${SUPABASE_URL}/functions/v1/galaxy-proxy`;
const DEFAULT_CAMPAIGN = "4679";

async function proxyFetch(params: Record<string, string>): Promise<unknown> {
  const url = new URL(PROXY_URL);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Proxy error: ${res.status}`);
  return res.json();
}

function extractData(json: unknown): unknown[] {
  const obj = json as Record<string, unknown>;
  const data = obj?.data as Record<string, unknown> | undefined;
  return (data?.data as unknown[]) ?? [];
}

export async function getRubricList(
  rubricId: string,
  campaignId = DEFAULT_CAMPAIGN,
): Promise<RubricItem[]> {
  const json = await proxyFetch({
    action: "rubric-list",
    campaign_id: campaignId,
    rubric_id: rubricId,
  });
  return extractData(json) as RubricItem[];
}

export async function getContentList(
  rubricId: string,
  campaignId = DEFAULT_CAMPAIGN,
): Promise<ContentItem[]> {
  const json = await proxyFetch({
    action: "content-list",
    campaign_id: campaignId,
    rubric_id: rubricId,
  });
  return extractData(json) as ContentItem[];
}

export async function getContentDetail(
  contentId: string,
  campaignId = DEFAULT_CAMPAIGN,
): Promise<ContentItem | null> {
  const json = await proxyFetch({
    action: "content-detail",
    campaign_id: campaignId,
    content_id: contentId,
  });
  const items = extractData(json) as ContentItem[];
  return items[0] ?? null;
}

export async function searchContent(
  query: string,
  page = 1,
  campaignId = DEFAULT_CAMPAIGN,
): Promise<ContentItem[]> {
  const json = await proxyFetch({
    action: "search",
    campaign_id: campaignId,
    search: query,
    page: String(page),
    itemsPerPage: "20",
  });
  return extractData(json) as ContentItem[];
}
