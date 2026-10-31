"use client";

import { FormEvent, useEffect, useState } from "react";

type Mode = "signin" | "signup" | "forgot" | "reset";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoveryTokens, setRecoveryTokens] = useState<{ accessToken: string; refreshToken: string } | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get("access_token");
    const refreshToken = hash.get("refresh_token");
    const type = hash.get("type");
    if (!accessToken || !refreshToken) return;
    window.history.replaceState({}, "", "/login");
    if (type === "recovery") {
      setRecoveryTokens({ accessToken, refreshToken });
      setMode("reset");
      return;
    }
    fetch("/api/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    }).then((response) => {
      if (response.ok) window.location.href = "/profile";
      else setError("That confirmation link is invalid or has expired.");
    });
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (mode === "reset" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const endpoint = mode === "signin" ? "/api/auth/sign-in" : mode === "signup" ? "/api/auth/sign-up" : mode === "forgot" ? "/api/auth/recover" : "/api/auth/update-password";
      const payload = mode === "forgot"
        ? { email }
        : mode === "signup"
          ? { email, password, fullName }
          : mode === "reset"
            ? { password, accessToken: recoveryTokens?.accessToken, refreshToken: recoveryTokens?.refreshToken }
            : { email, password };
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json() as { error?: string; message?: string; signedIn?: boolean };
      if (!response.ok) throw new Error(result.error ?? "Something went wrong.");
      if (mode === "signin" || mode === "reset" || result.signedIn) {
        window.location.href = "/profile";
        return;
      }
      setMessage(result.message ?? "Check your inbox for the next step.");
      if (mode === "signup") setMode("signin");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const titles = {
    signin: ["Welcome back", "Sign in to your Veil account."],
    signup: ["Create your account", "Start with three free 10-minute sessions."],
    forgot: ["Reset your password", "We’ll send a secure recovery link."],
    reset: ["Choose a new password", "Use at least eight characters."],
  } as const;

  return (
    <main className="auth-page">
      <div className="auth-backdrop"><i /><i /><i /></div>
      <nav className="auth-nav">
        <a className="brand" href="/"><span className="brand-mark" /><span>VEIL</span></a>
        <a href="/">Back to website <span>↗</span></a>
      </nav>

      <section className="auth-layout">
        <div className="auth-story">
          <div className="section-kicker">YOUR VEIL ACCOUNT</div>
          <h1>One account.<br /><em>Your time, protected.</em></h1>
          <p>Manage your profile, see your account details, and keep Veil ready for the moments that matter.</p>
          <div className="auth-benefits">
            <span><i>✓</i> Three free sessions to begin</span>
            <span><i>✓</i> Secure Supabase authentication</span>
            <span><i>✓</i> Your account stays isolated</span>
          </div>
        </div>

        <div className="auth-card-web">
          <div className="auth-card-top"><span className="mini-mark" /><span>SECURE ACCESS</span><i /></div>
          <div className="auth-card-copy">
            <h2>{titles[mode][0]}</h2>
            <p>{titles[mode][1]}</p>
          </div>

          {mode !== "forgot" && mode !== "reset" && (
            <div className="auth-switch" role="tablist">
              <button className={mode === "signin" ? "is-active" : ""} onClick={() => { setMode("signin"); setError(""); setMessage(""); }} type="button">Sign in</button>
              <button className={mode === "signup" ? "is-active" : ""} onClick={() => { setMode("signup"); setError(""); setMessage(""); }} type="button">Create account</button>
            </div>
          )}

          <form className="auth-form" onSubmit={submit}>
            {mode === "signup" && <label><span>Full name</span><input value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Alex Morgan" required /></label>}
            {mode !== "reset" && <label><span>Email address</span><input value={email} onChange={(event) => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="you@example.com" required /></label>}
            {mode !== "forgot" && <label><span>{mode === "reset" ? "New password" : "Password"}</span><input value={password} onChange={(event) => setPassword(event.target.value)} type="password" minLength={8} autoComplete={mode === "signin" ? "current-password" : "new-password"} placeholder="At least 8 characters" required /></label>}
            {(mode === "signup" || mode === "reset") && <label><span>Confirm password</span><input value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} type="password" minLength={8} autoComplete="new-password" placeholder="Repeat your password" required /></label>}
            {error && <div className="form-message is-error">{error}</div>}
            {message && <div className="form-message is-success">{message}</div>}
            <button className="auth-submit-web" disabled={loading} type="submit">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send recovery link" : "Update password"}
              {!loading && <span>↗</span>}
            </button>
          </form>

          {mode === "signin" && <button className="auth-text-button" type="button" onClick={() => { setMode("forgot"); setError(""); setMessage(""); }}>Forgot your password?</button>}
          {(mode === "forgot" || mode === "reset") && <button className="auth-text-button" type="button" onClick={() => { setMode("signin"); setError(""); setMessage(""); }}>Back to sign in</button>}
          <p className="auth-legal">By continuing, you agree to use Veil with consent and in accordance with applicable rules.</p>
        </div>
      </section>
    </main>
  );
}
