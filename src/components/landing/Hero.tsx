"use client";

import { useEffect, useRef } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Github } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { AppPreview } from "./AppPreview";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-eyebrow", { opacity: 0, y: 12, duration: 0.5 })
        .from(".hero-line", { opacity: 0, y: 28, duration: 0.7, stagger: 0.12 }, "-=0.2")
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
        .from(".hero-cta", { opacity: 0, y: 12, duration: 0.5 }, "-=0.35")
        .from(
          ".app-preview",
          { opacity: 0, y: 40, scale: 0.97, duration: 0.8, ease: "power2.out" },
          "-=0.3",
        )
        .from(
          ".preview-line",
          { opacity: 0, x: -8, duration: 0.4, stagger: 0.04 },
          "-=0.3",
        );

      // Cursor-tilt is its own motion effect (not part of the timeline
      // above) — needs the same reduced-motion guard, which this had been
      // missing even though the guard above covers the entrance sequence.
      const preview = previewRef.current;
      if (preview) {
        const handleMove = (e: MouseEvent) => {
          const rect = preview.getBoundingClientRect();
          const px = (e.clientX - rect.left) / rect.width - 0.5;
          const py = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(preview, {
            rotateX: py * -4,
            rotateY: px * 6,
            duration: 0.6,
            ease: "power2.out",
            transformPerspective: 1200,
          });
        };
        const handleLeave = () => {
          gsap.to(preview, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
        };
        preview.addEventListener("mousemove", handleMove);
        preview.addEventListener("mouseleave", handleLeave);
        return () => {
          preview.removeEventListener("mousemove", handleMove);
          preview.removeEventListener("mouseleave", handleLeave);
        };
      }
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative overflow-hidden px-6 pb-20 pt-24 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-moss/[0.07] blur-3xl"
      />

      <div className="mx-auto max-w-3xl text-center">
        <span className="hero-eyebrow inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-moss">
          <Github className="h-3.5 w-3.5" /> Open source · for freelancers &amp; small agencies
        </span>

        <h1 className="mt-7 font-display text-display-md leading-[1.05] text-ink md:text-display-lg">
          <span className="hero-line block font-medium not-italic">One true status</span>
          <span className="hero-line block italic">for every client project.</span>
        </h1>

        <p className="hero-sub mx-auto mt-7 max-w-lg text-lg leading-relaxed text-muted">
          Stop relaying updates through WhatsApp, email threads, and spreadsheets
          that all disagree. Ledger centralizes the work and shows the right
          slice to the right person, automatically.
        </p>

        <div className="hero-cta mt-9 flex items-center justify-center gap-4">
          <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
            <button
              className={`flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-moss-dark ${focusRing}`}
            >
              Get started free <ArrowRight className="h-4 w-4" />
            </button>
          </SignUpButton>
          <a
            href="#features"
            className={`rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition hover:bg-paper-dim ${focusRing}`}
          >
            See how it works
          </a>
        </div>
      </div>

      <div ref={previewRef} className="mt-16" style={{ transformStyle: "preserve-3d" }}>
        <AppPreview />
      </div>
    </section>
  );
}
