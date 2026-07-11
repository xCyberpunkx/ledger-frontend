"use client";

import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Ledger" width={28} height={28} priority />
          <span className="font-display text-xl italic text-ink">Ledger</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <a href="/#features" className="text-sm font-medium text-muted hover:text-ink">
            Features
          </a>
          <a href="/#pricing" className="text-sm font-medium text-muted hover:text-ink">
            Pricing
          </a>
          <Link href="/changelog" className="text-sm font-medium text-muted hover:text-ink">
            Changelog
          </Link>
          <Link href="/about" className="text-sm font-medium text-muted hover:text-ink">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="text-sm font-medium text-muted hover:text-ink">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-moss-dark">
                Get started
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="text-sm font-medium text-muted hover:text-ink">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
