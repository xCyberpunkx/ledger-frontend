"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

// "use client" is required here because Clerk's <SignedIn>/<SignedOut>
// components read auth state reactively in the browser. Everything else
// on this landing page stays a Server Component by default — this is the
// one island of interactivity in the nav.
export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight">
          Ledger
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-muted hover:text-ink">
            Features
          </a>
          <a href="#personas" className="text-sm font-medium text-muted hover:text-ink">
            How it works
          </a>
          <a href="#pricing" className="text-sm font-medium text-muted hover:text-ink">
            Pricing
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-medium text-muted hover:text-ink">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/30 transition hover:bg-primary-dark">
                Get started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted hover:text-ink"
            >
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
