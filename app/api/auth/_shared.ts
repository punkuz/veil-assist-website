import { env } from "cloudflare:workers";

export type SupabaseUser = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string | null;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  user?: SupabaseUser;
};

const ACCESS_COOKIE = "veil_access";
const REFRESH_COOKIE = "veil_refresh";

function config() {
  const runtimeEnv = env as unknown as Record<string, string | undefined>;
  const url = runtimeEnv.SUPABASE_URL?.replace(/\/$/, "");
  const key = runtimeEnv.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase authentication is not configured.");
  return { url, key };
}

export async function supabaseRequest(path: string, init: RequestInit = {}) {
  const { url, key } = config();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("Content-Type", "application/json");
  return fetch(`${url}${path}`, { ...init, headers });
}

export function accessToken(request: Request) {
  return readCookie(request, ACCESS_COOKIE);
}

export function refreshToken(request: Request) {
  return readCookie(request, REFRESH_COOKIE);
}

export function json(data: unknown, status = 200, extraHeaders?: Headers) {
  const headers = extraHeaders ?? new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(data), { status, headers });
}

export function sessionHeaders(session: SupabaseSession, request: Request) {
  const headers = new Headers();
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  const accessMaxAge = Math.max(60, session.expires_in ?? 3600);
  headers.append("Set-Cookie", `${ACCESS_COOKIE}=${encodeURIComponent(session.access_token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${accessMaxAge}${secure}`);
  headers.append("Set-Cookie", `${REFRESH_COOKIE}=${encodeURIComponent(session.refresh_token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=5184000${secure}`);
  return headers;
}

export function clearSessionHeaders(request: Request) {
  const headers = new Headers();
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  headers.append("Set-Cookie", `${ACCESS_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
  headers.append("Set-Cookie", `${REFRESH_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
  return headers;
}

export async function responseError(response: Response) {
  const payload = await response.json().catch(() => ({})) as { msg?: string; message?: string; error_description?: string };
  return payload.msg ?? payload.message ?? payload.error_description ?? "Authentication request failed.";
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return decodeURIComponent(rest.join("="));
  }
  return null;
}
