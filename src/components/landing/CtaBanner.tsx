"use client";

import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-paper-dim/50 px-10 py-16 text-center">
        <h2 className="font-display text-3xl italic text-ink md:text-4xl">
          Run client work like it&apos;s written down once.
        </h2>
        <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
          <button className="mx-auto mt-8 flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-moss-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper">
            Get started free <ArrowRight className="h-4 w-4" />
          </button>
        </SignUpButton>
      </div>
    </section>
  );
}
