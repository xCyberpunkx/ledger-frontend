"use client";

import { useEffect, useRef } from "react";
import { Github, GitPullRequest, ScrollText } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ArchitectureStack } from "./ArchitectureStack";

const stack = [
  "Next.js", "TypeScript", "React", "Tailwind CSS",
  "NestJS", "Prisma", "PostgreSQL", "Docker",
  "Clerk", "Cloudinary", "Resend", "Sentry",
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

export function DeveloperSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.from(".stack-pill", {
        opacity: 0,
        y: 12,
        stagger: 0.04,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="developers" className="bg-ink px-6 py-28 text-paper">
      <div className="mx-auto grid max-w-5xl items-center gap-14 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-gold">Open source · MIT</p>
          <h2 className="mt-4 font-display text-3xl italic text-paper md:text-display-sm">
            Built in the open, on a stack you already trust
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">
            No hidden backend, no black-box auth. Two repositories — NestJS API,
            Next.js frontend — a Prisma schema you can read end to end, and a
            request path with nothing skipped in between.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {stack.map((s) => (
              <span
                key={s}
                className="stack-pill rounded-full border border-paper/15 px-3 py-1 font-mono text-[11px] text-paper/70"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-paper-dim ${focusRing}`}
            >
              <Github className="h-4 w-4" /> View on GitHub
            </a>
            <a
              href="#roadmap"
              className={`flex items-center gap-2 rounded-full border border-paper/20 px-5 py-2.5 text-sm font-semibold text-paper/80 transition hover:bg-paper/5 ${focusRing}`}
            >
              <ScrollText className="h-4 w-4" /> Roadmap
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className={`flex items-center gap-2 rounded-full border border-paper/20 px-5 py-2.5 text-sm font-semibold text-paper/80 transition hover:bg-paper/5 ${focusRing}`}
            >
              <GitPullRequest className="h-4 w-4" /> Contribute
            </a>
          </div>
        </div>

        <ArchitectureStack />
      </div>
    </section>
  );
}
