import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const PACKAGE_RE = /^[a-zA-Z][a-zA-Z0-9_]*(\.[a-zA-Z][a-zA-Z0-9_]*)+$/;
const ICON_RE = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pkg = url.searchParams.get("package") ?? "";
    const size = Number(url.searchParams.get("size") ?? "192");

    if (!PACKAGE_RE.test(pkg)) {
      return json({ error: "invalid package name" }, 400);
    }

    const playUrl = `https://play.google.com/store/apps/details?id=${encodeURIComponent(pkg)}&hl=en_US`;
    const res = await fetch(playUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    if (!res.ok) {
      return json({ error: "play store fetch failed", status: res.status }, 502);
    }

    const html = await res.text();
    const match = html.match(ICON_RE);
    if (!match) {
      return json({ error: "icon not found" }, 404);
    }

    const base = match[1].split("=")[0];
    const sized = `${base}=w${size}-h${size}`;

    return new Response(
      JSON.stringify({ iconUrl: sized, packageName: pkg }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      },
    );
  } catch (err) {
    return json({ error: String(err) }, 500);
  }
});
