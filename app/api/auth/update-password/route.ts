import { json, responseError, sessionHeaders, supabaseRequest, type SupabaseSession } from "../_shared";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { accessToken?: string; refreshToken?: string; password?: string };
  if (!body.accessToken || !body.refreshToken || !body.password) return json({ error: "The recovery link is incomplete." }, 400);
  if (body.password.length < 8) return json({ error: "Use at least 8 characters for your password." }, 400);
  const response = await supabaseRequest("/auth/v1/user", {
    method: "PUT",
    headers: { Authorization: `Bearer ${body.accessToken}` },
    body: JSON.stringify({ password: body.password }),
  });
  if (!response.ok) return json({ error: await responseError(response) }, response.status);
  const user = await response.json();
  const session: SupabaseSession = { access_token: body.accessToken, refresh_token: body.refreshToken, expires_in: 3600, user };
  return json({ user }, 200, sessionHeaders(session, request));
}
