import type { ContentItem, RubricItem } from "../types/content.ts";

const SUPABASE_URL = "https://kcassdxkjwiceddjjekd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtjYXNzZHhrandpY2VkZGpqZWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2NjcxNTksImV4cCI6MjA4OTI0MzE1OX0.AoIg8kiUvLG3pu9JMgOH6JTUX1wIGMpLDsPaLfUR728";
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
  authToken?: string,
): Promise<RubricItem[]> {
  const params: Record<string, string> = {
    action: "rubric-list",
    campaign_id: campaignId,
    rubric_id: rubricId,
  };
  if (authToken) params.authtoken = authToken;
  const json = await proxyFetch(params);
  return extractData(json) as RubricItem[];
}

export async function getContentList(
  rubricId: string,
  campaignId = DEFAULT_CAMPAIGN,
  authToken?: string,
): Promise<ContentItem[]> {
  const params: Record<string, string> = {
    action: "content-list",
    campaign_id: campaignId,
    rubric_id: rubricId,
  };
  if (authToken) params.authtoken = authToken;
  const json = await proxyFetch(params);
  return extractData(json) as ContentItem[];
}

export async function getContentDetail(
  contentId: string,
  campaignId = DEFAULT_CAMPAIGN,
  authToken?: string,
): Promise<ContentItem | null> {
  const params: Record<string, string> = {
    action: "content-detail",
    campaign_id: campaignId,
    content_id: contentId,
  };
  if (authToken) params.authtoken = authToken;
  const json = await proxyFetch(params);
  const items = extractData(json) as ContentItem[];
  return items[0] ?? null;
}

export async function searchContent(
  query: string,
  page = 1,
  campaignId = DEFAULT_CAMPAIGN,
  authToken?: string,
): Promise<ContentItem[]> {
  const params: Record<string, string> = {
    action: "search",
    campaign_id: campaignId,
    search: query,
    page: String(page),
    itemsPerPage: "20",
  };
  if (authToken) params.authtoken = authToken;
  const json = await proxyFetch(params);
  return extractData(json) as ContentItem[];
}
