import { json, responseError, sessionHeaders, supabaseRequest, type SupabaseSession } from "../_shared";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string; password?: string; fullName?: string };
  if (!body.email || !body.password) return json({ error: "Email and password are required." }, 400);
  if (body.password.length < 8) return json({ error: "Use at least 8 characters for your password." }, 400);

  try {
    const origin = new URL(request.url).origin;
    const response = await supabaseRequest(`/auth/v1/signup?redirect_to=${encodeURIComponent(`${origin}/login`)}`, {
      method: "POST",
      body: JSON.stringify({
        email: body.email.trim(),
        password: body.password,
        data: { full_name: body.fullName?.trim() || undefined },
      }),
    });
    if (!response.ok) return json({ error: await responseError(response) }, response.status);
    const result = await response.json() as SupabaseSession;
    if (result.access_token && result.refresh_token) {
      return json({ user: result.user, signedIn: true }, 200, sessionHeaders(result, request));
    }
    return json({ signedIn: false, message: "Check your inbox to confirm your email, then sign in." });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to create your account." }, 500);
  }
}
