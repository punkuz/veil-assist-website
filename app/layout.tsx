import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    title: "Veil Assist — Stay present. Veil keeps up.",
    description: "A privacy-aware floating desktop assistant for calls, presentations, and focused work.",
    icons: { icon: "/veil-icon.svg", shortcut: "/veil-icon.svg" },
    openGraph: {
      title: "Veil Assist — Stay present. Veil keeps up.",
      description: "A calm, floating assistant for calls and presentations.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1200, height: 630, alt: "Veil Assist — Stay present. Veil keeps up." }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Veil Assist",
      description: "Stay present. Veil keeps up.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
