"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const chaosItems = [
  "17 unread WhatsApp messages",
  "\u201cquick question\u201d thread, 43 replies",
  "Status_FINAL_v3.xlsx",
  "wrong Drive folder shared",
  "\u201cany update?\u201d — sent Tuesday",
];

export function ChaosToClarity() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          end: "bottom 60%",
          scrub: 0.6,
        },
      });

      // Scattered chaos tags start at random rotations/offsets, then
      // settle flat into a line as the user scrolls — literally dramatizing
      // "status stops living in five places that disagree with each other."
      tl.from(".chaos-tag", {
        opacity: 0,
        y: (i) => (i % 2 === 0 ? -40 : 40),
        rotate: (i) => (i % 2 === 0 ? -8 : 8),
        stagger: 0.08,
        duration: 0.6,
      }).to(".chaos-tag", { rotate: 0, y: 0, duration: 0.5, stagger: 0.05 }, "+=0.1")
        .from(
          ".ledger-row",
          { opacity: 0, x: -16, stagger: 0.08, duration: 0.4 },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="how-it-works" className="px-6 py-28">
      <div className="mx-auto max-w-4xl">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-muted">
          Before → after
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {chaosItems.map((item) => (
            <span
              key={item}
              className="chaos-tag rounded-full border border-border bg-paper-dim px-4 py-2 text-sm text-muted"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-xl rounded-2xl border border-border bg-paper-dim/60 p-2">
          <div className="rounded-xl bg-paper p-5">
            <div className="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-widest text-muted">
              <span>Project</span>
              <span>Status</span>
              <span>Updated</span>
            </div>
            {[
              ["Halden Retail", "On track", "2h ago"],
              ["Voss Studio", "Needs input", "1d ago"],
              ["Marsh & Co.", "Delivered", "Just now"],
            ].map(([client, status, updated]) => (
              <div
                key={client}
                className="ledger-row flex items-center justify-between border-t border-border py-3 text-sm"
              >
                <span className="font-medium text-ink">{client}</span>
                <span className="text-muted">{status}</span>
                <span className="font-mono text-xs text-muted">{updated}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
