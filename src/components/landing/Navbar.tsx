"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Github, Menu, X } from "lucide-react";
import { gsap } from "@/lib/gsap";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#developers", label: "Developers" },
  { href: "/#security", label: "Security" },
  { href: "/#roadmap", label: "Roadmap" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on Escape and lock scroll while the mobile menu is open — the
  // two things a "just conditionally render a div" mobile menu usually
  // forgets.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
      );
      gsap.from(".mobile-link", {
        opacity: 0,
        y: 10,
        stagger: 0.05,
        delay: 0.1,
        duration: 0.3,
      });
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="Ledger" width={28} height={28} priority />
          <span className="font-display text-xl italic text-ink">Ledger</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-muted hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Ledger on GitHub"
            className="text-muted hover:text-ink"
          >
            <Github className="h-4 w-4" />
          </a>
          <SignedOut>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="text-sm font-medium text-muted hover:text-ink">Log in</button>
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

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="text-ink lg:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div ref={menuRef} className="border-t border-border bg-paper px-6 py-6 lg:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="mobile-link rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-paper-dim"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="mobile-link mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <SignedOut>
              <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="rounded-full border border-border py-2.5 text-sm font-semibold text-ink">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button className="rounded-full bg-ink py-2.5 text-sm font-semibold text-paper">
                  Get started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink py-2.5 text-center text-sm font-semibold text-paper"
              >
                Dashboard
              </Link>
            </SignedIn>
          </div>
        </div>
      )}
    </header>
  );
}
