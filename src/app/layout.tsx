import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// next/font/google self-hosts at build time — no runtime request, no
// layout shift. Fraunces is an editorial serif with real personality for
// headlines; Inter carries body copy and UI text where legibility matters
// more than character.
const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

// This file has no "use client" directive, so it's a Server Component —
// it renders on the server and ships zero JS for this layout itself.
// Metadata here is how Next.js does SEO: it's read at build/request time
// and injected into <head>, no manual <title> tag juggling.
export const metadata: Metadata = {
  title: "Ledger — client work, one true status",
  description:
    "Ledger centralizes freelance and agency client work at the client boundary, so status stops living in five places that disagree with each other.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${display.variable} ${body.variable}`}>
        <body className="min-h-screen bg-paper font-body text-ink antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
