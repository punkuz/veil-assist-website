import { json, responseError, supabaseRequest } from "../_shared";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({})) as { email?: string };
  if (!body.email) return json({ error: "Enter your email address." }, 400);
  try {
    const origin = new URL(request.url).origin;
    const response = await supabaseRequest(`/auth/v1/recover?redirect_to=${encodeURIComponent(`${origin}/login`)}`, {
      method: "POST",
      body: JSON.stringify({ email: body.email.trim() }),
    });
    if (!response.ok) return json({ error: await responseError(response) }, response.status);
    return json({ message: "If that email is registered, a recovery link is on its way." });
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Unable to send a recovery email." }, 500);
  }
}
