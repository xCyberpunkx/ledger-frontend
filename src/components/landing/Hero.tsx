"use client";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative px-6 pb-10 pt-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[110px]" />
      <div className="pointer-events-none absolute right-0 top-40 h-[360px] w-[360px] rounded-full bg-pink/25 blur-[100px]" />

      <div className="relative mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-soft px-4 py-1.5 text-xs font-semibold text-primary">
          Built for freelancers &amp; small agencies
        </span>
        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
          One true status for every client project.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
          Stop relaying updates through WhatsApp, email threads, and spreadsheets that all
          disagree. Ledger centralizes the work and shows the right slice to the right
          person, automatically.
        </p>
        <div className="mt-9 flex items-center justify-center gap-4">
          <SignUpButton mode="modal">
            <button className="flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:bg-primary-dark">
              Get started free <ArrowRight className="h-4 w-4" />
            </button>
          </SignUpButton>
          <a
            href="#personas"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:bg-surface-soft"
          >
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
