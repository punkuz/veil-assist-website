import { json, responseError, sessionHeaders, supabaseRequest, type SupabaseSession } from "../_shared";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string };
  if (!body.email || !body.password) return json({ error: "Email and password are required." }, 400);

  try {
    const response = await supabaseRequest("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({ email: body.email.trim(), password: body.password }),
    });
    if (!response.ok) return json({ error: await responseError(response) }, response.status);
    const session = await response.json() as SupabaseSession;
    return json({ user: session.user }, 200, sessionHeaders(session, request));
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to sign in." }, 500);
  }
}
