"use client";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="px-6 py-24">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl bg-ink px-10 py-16 text-center">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-pink/30 blur-[100px]" />
        <h2 className="relative font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
          Run client work like it&apos;s written down once.
        </h2>
        <SignUpButton mode="modal">
          <button className="relative mx-auto mt-8 flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink shadow-lg transition hover:bg-surface-soft">
            Get started free <ArrowRight className="h-4 w-4" />
          </button>
        </SignUpButton>
      </div>
    </section>
  );
}
