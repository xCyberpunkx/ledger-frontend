"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const personas = [
  {
    role: "Owner",
    sees: "Every client, every project, every teammate — the whole org.",
  },
  {
    role: "Team member",
    sees: "Only the projects they're assigned to. Nothing else in the org.",
  },
  {
    role: "Client",
    sees: "Their own project, sandboxed. No other clients, no internal tasks.",
  },
];

export function Personas() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".persona-card", {
        opacity: 0,
        y: 24,
        stagger: 0.12,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="personas" ref={rootRef} className="mx-auto max-w-6xl px-6 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">
          Access, enforced
        </p>
        <h2 className="mt-4 font-display text-3xl italic text-ink">
          Three people, three views, one project
        </h2>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {personas.map((p, i) => (
          <div
            key={p.role}
            className="persona-card rounded-2xl border border-border bg-paper-dim/50 p-7"
          >
            <span className="font-mono text-xs text-gold">0{i + 1}</span>
            <h3 className="mt-3 font-display text-xl text-ink">{p.role}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{p.sees}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
