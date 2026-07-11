import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// next/font/google downloads + self-hosts the font at build time — no
// runtime request to Google, no layout shift waiting on a <link> tag.
// The CSS variable is how we hand it to Tailwind (see tailwind.config.ts).
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

// This file has no "use client" directive, so it's a Server Component —
// it renders on the server and ships zero JS for this layout itself.
// Metadata here is how Next.js does SEO: it's read at build/request time
// and injected into <head>, no manual <title> tag juggling.
export const metadata: Metadata = {
  title: "Ledger — the truth about your client work",
  description:
    "Ledger centralizes freelance and agency client work at the client boundary, so status stops living in five places that disagree with each other.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-ink font-body text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
