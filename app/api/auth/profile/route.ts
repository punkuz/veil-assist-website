import { accessToken, clearSessionHeaders, json, refreshToken, responseError, sessionHeaders, supabaseRequest, type SupabaseSession } from "../_shared";

async function getUser(token: string) {
  return supabaseRequest("/auth/v1/user", { headers: { Authorization: `Bearer ${token}` } });
}

export async function GET(request: Request) {
  let token = accessToken(request);
  let response = token ? await getUser(token) : null;
  let refreshed: SupabaseSession | null = null;

  if (!response?.ok) {
    const refresh = refreshToken(request);
    if (!refresh) return json({ error: "Not signed in." }, 401, clearSessionHeaders(request));
    const refreshResponse = await supabaseRequest("/auth/v1/token?grant_type=refresh_token", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refresh }),
    });
    if (!refreshResponse.ok) return json({ error: "Your session has expired." }, 401, clearSessionHeaders(request));
    refreshed = await refreshResponse.json() as SupabaseSession;
    token = refreshed.access_token;
    response = await getUser(token);
  }

  if (!response.ok) return json({ error: await responseError(response) }, 401, clearSessionHeaders(request));
  const user = await response.json();
  return json({ user }, 200, refreshed ? sessionHeaders(refreshed, request) : undefined);
}

export async function PATCH(request: Request) {
  const token = accessToken(request);
  if (!token) return json({ error: "Not signed in." }, 401);
  const body = await request.json().catch(() => ({})) as { fullName?: string };
  const fullName = body.fullName?.trim();
  if (!fullName) return json({ error: "Enter your name." }, 400);
  const response = await supabaseRequest("/auth/v1/user", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ data: { full_name: fullName } }),
  });
  if (!response.ok) return json({ error: await responseError(response) }, response.status);
  return json({ user: await response.json() });
}
