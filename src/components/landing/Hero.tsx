"use client";

import { useEffect, useRef } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    // gsap.context() scopes selectors + auto-cleans on unmount — the React
    // way to use GSAP without animations leaking into a page you navigated
    // away from.
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(
          ".hero-line",
          { opacity: 0, y: 28, duration: 0.7, stagger: 0.12 },
          "-=0.2",
        )
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 12, duration: 0.5 }, "-=0.35");

      // The line "draws" itself: start with the full stroke hidden via
      // dashoffset, animate it back to 0. No plugin needed, just SVG's
      // own stroke-dasharray/-dashoffset mechanics.
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength();
        gsap.set(lineRef.current, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(lineRef.current, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "-=0.4");
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative px-6 pb-16 pt-24">
      <div className="mx-auto max-w-3xl text-center">
        <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-moss">
          For freelancers &amp; small agencies
        </span>

        <h1 className="mt-7 font-display text-5xl italic leading-[1.08] tracking-tight text-ink md:text-6xl">
          <span className="hero-line block not-italic font-medium">
            One true status
          </span>
          <span className="hero-line block">for every client project.</span>
        </h1>

        <p className="hero-sub mx-auto mt-7 max-w-lg text-lg leading-relaxed text-muted">
          Stop relaying updates through WhatsApp, email threads, and spreadsheets
          that all disagree. Ledger centralizes the work and shows the right
          slice to the right person, automatically.
        </p>

        <div className="hero-cta mt-9 flex items-center justify-center gap-4">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button className="flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-moss-dark">
              Get started free <ArrowRight className="h-4 w-4" />
            </button>
          </SignUpButton>
          <a
            href="#features"
            className="rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:bg-paper-dim"
          >
            See how it works
          </a>
        </div>
      </div>

      <svg
        viewBox="0 0 1200 80"
        className="mx-auto mt-14 w-full max-w-4xl"
        fill="none"
      >
        <path
          ref={lineRef}
          d="M0 40 C 150 10, 300 70, 450 40 S 750 10, 900 40 S 1100 70, 1200 40"
          stroke="#3F5B4E"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </section>
  );
}
