import { json, responseError, sessionHeaders, supabaseRequest, type SupabaseSession } from "../_shared";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { accessToken?: string; refreshToken?: string };
  if (!body.accessToken || !body.refreshToken) return json({ error: "The sign-in link is incomplete or expired." }, 400);
  const response = await supabaseRequest("/auth/v1/user", { headers: { Authorization: `Bearer ${body.accessToken}` } });
  if (!response.ok) return json({ error: await responseError(response) }, 401);
  const user = await response.json();
  const session: SupabaseSession = { access_token: body.accessToken, refresh_token: body.refreshToken, expires_in: 3600, user };
  return json({ user }, 200, sessionHeaders(session, request));
}
