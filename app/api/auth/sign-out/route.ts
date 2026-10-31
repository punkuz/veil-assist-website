import { accessToken, clearSessionHeaders, json, supabaseRequest } from "../_shared";

export async function POST(request: Request) {
  const token = accessToken(request);
  if (token) await supabaseRequest("/auth/v1/logout", { method: "POST", headers: { Authorization: `Bearer ${token}` } }).catch(() => null);
  return json({ signedOut: true }, 200, clearSessionHeaders(request));
}
