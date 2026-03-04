const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string) ||
  "https://bdutbevipdtnierfwixy.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkdXRiZXZpcGR0bmllcmZ3aXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4NTY3MDYsImV4cCI6MjA4NzQzMjcwNn0.Ko53PZWSGRSuK1jZ8--6vFbEvGSB36i7s_0CzqJQimY";
const PROXY_URL = `${SUPABASE_URL}/functions/v1/kliento-proxy`;

export interface KlientoUser {
  user_id: string;
  authToken?: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  nickname?: string;
  subscribed: boolean | null;
  total_credit?: number;
  dve_login?: string;
}

interface LoginResponse {
  code: number;
  error: number;
  data: { user_id: number | boolean };
}

interface AccountInfoToken {
  token: string;
  content: string;
  token_type: string;
  immutable: boolean;
  date_start: string;
}

interface AccountInfoResponse {
  code: number;
  error: number;
  data?: Array<{
    user_id: string;
    email: string | null;
    firstname: string | null;
    lastname: string | null;
    nickname: string | null;
    dve_login: string | null;
    subscribed: boolean | null;
    total_credit: number | null;
    token?: AccountInfoToken[];
  }>;
  message?: string;
}

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

export async function login(
  username: string,
  password: string,
): Promise<{ userId: string } | { error: string }> {
  const json = (await proxyFetch({
    action: "login",
    login: username,
    password,
  })) as LoginResponse;

  if (json.data?.user_id && typeof json.data.user_id === "number") {
    return { userId: String(json.data.user_id) };
  }
  return { error: "Identifiants incorrects" };
}

export async function getAccountInfo(
  userId: string,
): Promise<KlientoUser | null> {
  const json = (await proxyFetch({
    action: "accountinfo",
    user_id: userId,
  })) as AccountInfoResponse;

  if (json.error !== 0 || !json.data || json.data.length === 0) {
    return null;
  }

  const user = json.data[0];
  const authTokenEntry = user.token?.find((t) => t.content === "authtoken");
  return {
    user_id: user.user_id,
    authToken: authTokenEntry?.token,
    email: user.email ?? undefined,
    firstname: user.firstname ?? undefined,
    lastname: user.lastname ?? undefined,
    nickname: user.nickname ?? undefined,
    subscribed: user.subscribed,
    total_credit: user.total_credit ?? undefined,
    dve_login: user.dve_login ?? undefined,
  };
}
