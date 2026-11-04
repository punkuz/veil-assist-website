"use client";

import { FormEvent, useEffect, useState } from "react";

type User = {
  id: string;
  email?: string;
  created_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string | null;
  user_metadata?: { full_name?: string };
};

type Entitlement = {
  role: "user" | "admin";
  paid_credits: number;
  trial_sessions_remaining: number;
};

function displayDate(value?: string) {
  if (!value) return "Not available";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [entitlement, setEntitlement] = useState<Entitlement | null>(null);
  const [entitlementError, setEntitlementError] = useState("");
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/auth/profile", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          window.location.href = "/login";
          return null;
        }
        return response.json() as Promise<{ user: User; entitlement: Entitlement | null; entitlementError?: string | null }>;
      })
      .then((result) => {
        if (!result) return;
        setUser(result.user);
        setEntitlement(result.entitlement);
        setEntitlementError(result.entitlementError ?? "");
        setFullName(result.user.user_metadata?.full_name ?? "");
        setLoading(false);
      })
      .catch(() => { window.location.href = "/login"; });
  }, []);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    const response = await fetch("/api/auth/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName }),
    });
    const result = await response.json() as { user?: User; error?: string };
    if (!response.ok || !result.user) {
      setMessage(result.error ?? "Unable to save your profile.");
      return;
    }
    setUser(result.user);
    setEditing(false);
    setMessage("Profile updated.");
  }

  async function signOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    window.location.href = "/";
  }

  if (loading || !user) return <main className="profile-loading"><span className="brand-mark" /><p>Loading your Veil account…</p></main>;

  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "Veil user";
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
  const isAdmin = entitlement?.role === "admin";
  const trials = Math.max(0, Number(entitlement?.trial_sessions_remaining ?? 0));
  const paidCredits = Math.max(0, Number(entitlement?.paid_credits ?? 0));

  return (
    <main className="profile-page">
      <div className="profile-glow" />
      <nav className="profile-nav shell-width">
        <a className="brand" href="/"><span className="brand-mark" /><span>VEIL</span><span className="beta-badge">BETA</span></a>
        <div><a href="/#pricing">Pricing</a><button type="button" onClick={signOut}>Sign out</button></div>
      </nav>

      <section className="profile-shell shell-width">
        <header className="profile-header">
          <div><div className="section-kicker">ACCOUNT OVERVIEW</div><h1>Welcome back,<br /><em>{name}.</em></h1></div>
          <div className="profile-status"><i /><span>Account active</span></div>
        </header>

        <div className="profile-grid">
          <article className="profile-card profile-main-card">
            <div className="profile-card-label"><span>YOUR PROFILE</span><button type="button" onClick={() => setEditing(!editing)}>{editing ? "Cancel" : "Edit profile"}</button></div>
            <div className="profile-identity">
              <div className="profile-avatar">{initials}</div>
              <div><h2>{name}</h2><p>{user.email}</p></div>
              <span className={user.email_confirmed_at ? "verified-badge" : "verified-badge is-pending"}>{user.email_confirmed_at ? "✓ Verified" : "Pending"}</span>
            </div>
            {editing && <form className="profile-edit" onSubmit={saveProfile}><label><span>Display name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} required /></label><button type="submit">Save changes</button></form>}
            {message && <div className="profile-message">{message}</div>}
            <div className="profile-details">
              <div><span>Joined Veil</span><b>{displayDate(user.created_at)}</b></div>
              <div><span>Last sign-in</span><b>{displayDate(user.last_sign_in_at)}</b></div>
              <div><span>Account ID</span><b className="mono-detail">{user.id}</b></div>
            </div>
          </article>

          <article className="profile-card balance-card">
            <div className="profile-card-label"><span>SESSION BALANCE</span><i>{isAdmin ? "ADMIN" : "LIVE"}</i></div>
            {entitlementError ? (
              <div className="balance-error"><span>!</span><div><b>Balance unavailable</b><small>{entitlementError}</small></div></div>
            ) : isAdmin ? (
              <div className="admin-balance"><strong>∞</strong><div><b>Unlimited access</b><small>Administrator accounts do not consume trials or credits.</small></div></div>
            ) : (
              <div className="balance-grid">
                <div className="balance-stat"><strong>{trials}</strong><span>Free trials</span><small>10 minutes each</small></div>
                <div className="balance-stat is-paid"><strong>{paidCredits}</strong><span>Paid credits</span><small>30 minutes each</small></div>
              </div>
            )}
            <a href="/#pricing">View credit packs <span>↗</span></a>
          </article>

          <article className="profile-card security-card">
            <div className="profile-card-label"><span>SECURITY</span><i>PROTECTED</i></div>
            <div className="security-row"><span>◎</span><div><b>Email authentication</b><small>Managed securely by Supabase</small></div><i>ON</i></div>
            <div className="security-row"><span>◇</span><div><b>Private session</b><small>Stored in a secure, HTTP-only cookie</small></div><i>ON</i></div>
            <a href="/login">Reset your password <span>↗</span></a>
          </article>

          <article className="profile-card download-card">
            <div><span className="mini-mark" /><small>VEIL FOR DESKTOP</small></div>
            <h3>Your assistant is ready.</h3>
            <p>Choose your platform, install the latest beta, and sign in with this account.</p>
            <div className="profile-download-actions">
              <a href="https://github.com/punkuz/veil-releases/releases/download/v0.7.0-beta.18/Veil.Assist-0.7.0-beta.18-arm64.dmg">Mac · Apple <span>↓</span></a>
              <a href="https://github.com/punkuz/veil-releases/releases/download/v0.7.0-beta.18/Veil.Assist-0.7.0-beta.18.dmg">Mac · Intel <span>↓</span></a>
              <a href="https://github.com/punkuz/veil-releases/releases/download/v0.7.0-beta.18/Veil.Assist.Setup.0.7.0-beta.18.exe">Windows <span>↓</span></a>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
