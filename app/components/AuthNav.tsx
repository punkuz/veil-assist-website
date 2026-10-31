"use client";

import { useEffect, useState } from "react";

export function AuthNav() {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  useEffect(() => {
    fetch("/api/auth/profile", { cache: "no-store" })
      .then((response) => setSignedIn(response.ok))
      .catch(() => setSignedIn(false));
  }, []);

  return (
    <a className="account-link" href={signedIn ? "/profile" : "/login"}>
      <span className={signedIn ? "account-dot is-online" : "account-dot"} />
      {signedIn ? "Profile" : "Log in"}
    </a>
  );
}
