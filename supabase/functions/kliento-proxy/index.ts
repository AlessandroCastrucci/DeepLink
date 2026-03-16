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
      const loginType = url.searchParams.get("loginType") || "dve";

      if (!login) {
        return new Response(
          JSON.stringify({ error: "Missing login" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      let apiUrl: string;

      if (loginType === "msisdn-nopin") {
        apiUrl = `${BASE_URL}/login/msisdn?service_id=${SERVICE_ID}&msisdn=${encodeURIComponent(login)}`;
      } else {
        if (!password) {
          return new Response(
            JSON.stringify({ error: "Missing password" }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            },
          );
        }
        const hashedPassword = await hashPassword(password);
        apiUrl = `${BASE_URL}/login/dve?service_id=${SERVICE_ID}&login=${encodeURIComponent(login)}&password_dve=${hashedPassword}`;
      }

      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "create") {
      const credentialType = url.searchParams.get("credentialType") || "";
      const value = url.searchParams.get("value") || "";
      const password = url.searchParams.get("password") || "";

      if (!credentialType || !password) {
        return new Response(
          JSON.stringify({ error: "Missing credentialType, value, or password" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const hashedPassword = await hashPassword(password);
      const params = new URLSearchParams({
        service_id: SERVICE_ID,
        password_dve: hashedPassword,
      });

      if (credentialType === "username") {
        params.set("login", value);
      } else if (credentialType === "email") {
        params.set("email", value);
      } else if (credentialType === "msisdn") {
        params.set("msisdn", value);
        params.set("login", value);
      } else {
        return new Response(
          JSON.stringify({ error: "Invalid credentialType. Use 'username', 'email', or 'msisdn'" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const apiUrl = `${BASE_URL}/account/create?${params.toString()}`;
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

    if (action === "create") {
      const login = url.searchParams.get("login") || "";
      const email = url.searchParams.get("email") || "";
      const password = url.searchParams.get("password") || "";

      if (!login || !email || !password) {
        return new Response(
          JSON.stringify({ error: "Missing login, email or password" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const apiUrl = `https://user.contactdve.com/account/create?service_id=${SERVICE_ID}&login=${encodeURIComponent(login)}&email=${encodeURIComponent(email)}&password_dve=${encodeURIComponent(password)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'login', 'accountinfo' or 'create'" }),
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
