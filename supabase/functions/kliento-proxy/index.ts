import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BASE_URL = "https://userv1.dv-content.io";
const SERVICE_ID = "39";
const HASH_PREFIX = "f5c028c81f";
const HASH_SUFFIX = "560e6cd05c8513b96062b0";

async function sha1Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashPassword(password: string): Promise<string> {
  return sha1Hex(HASH_PREFIX + password + HASH_SUFFIX);
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "login") {
      const login = url.searchParams.get("login") || "";
      const password = url.searchParams.get("password") || "";

      if (!login || !password) {
        return new Response(
          JSON.stringify({ error: "Missing login or password" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const hashedPassword = await hashPassword(password);
      const apiUrl = `${BASE_URL}/login/dve?service_id=${SERVICE_ID}&login=${encodeURIComponent(login)}&password_dve=${hashedPassword}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "accountinfo") {
      const userId = url.searchParams.get("user_id") || "";

      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Missing user_id" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const apiUrl = `${BASE_URL}/accountinfo/all?service_id=${SERVICE_ID}&user_id=${userId}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'login' or 'accountinfo'" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
