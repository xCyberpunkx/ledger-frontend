import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

// next/font/google self-hosts the font at build time — no runtime request
// to Google, no layout shift. The CSS variable is how we hand it to
// Tailwind (see tailwind.config.ts -> fontFamily).
const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${display.variable} ${body.variable}`}>
        <body className="min-h-screen bg-surface font-body text-ink antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
