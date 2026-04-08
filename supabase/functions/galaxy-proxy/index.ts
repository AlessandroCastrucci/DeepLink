import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const API_KEY = "api_key_iatest";
const API_SECRET = "GaLxAiDviTS12*";
const BASE_URL = "https://galaxy-api.galaxydve.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");
    const campaignId = url.searchParams.get("campaign_id") || "4679";
    const rubricId = url.searchParams.get("rubric_id") || "";
    const contentId = url.searchParams.get("content_id") || "";
    const search = url.searchParams.get("search") || "";
    const page = url.searchParams.get("page") || "1";
    const itemsPerPage = url.searchParams.get("itemsPerPage") || "20";

    let apiUrl = "";

    switch (action) {
      case "rubric-list":
        apiUrl = `${BASE_URL}/publishing-rubric-list?api_key=${API_KEY}&api_secret_key=${API_SECRET}&country_code=fr&language_code=fr&campaign_id=${campaignId}&rubric_id=${rubricId}`;
        break;

      case "content-list":
        apiUrl = `${BASE_URL}/publishing-content-list?api_key=${API_KEY}&api_secret_key=${API_SECRET}&country_code=fr&language_code=fr&campaign_id=${campaignId}&rubric_id=${rubricId}&preview=true&asset=true&delivery=true`;
        break;

      case "content-detail":
        apiUrl = `${BASE_URL}/publishing-content-detail?api_key=${API_KEY}&api_secret_key=${API_SECRET}&country_code=fr&language_code=fr&campaign_id=${campaignId}&content_id=${contentId}&preview=true&asset=true&delivery=true`;
        break;

      case "search":
        apiUrl = `${BASE_URL}/publishing-content-list?content_title=${encodeURIComponent(search)}&content_type=html&preview=true&asset=true&delivery=true&without_token=true&itemsPerPage=${itemsPerPage}&page=${page}&api_key=${API_KEY}&api_secret_key=${API_SECRET}&country_code=fr&language_code=fr&campaign_id=${campaignId}`;
        break;

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
    }

    const response = await fetch(apiUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
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
