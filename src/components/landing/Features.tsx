"use client";

import { useEffect, useRef } from "react";
import {
  KanbanSquare,
  FolderClosed,
  Activity,
  BellRing,
  LayoutDashboard,
  ShieldCheck,
  Search,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const features = [
  {
    icon: KanbanSquare,
    title: "Tasks, kanban and list",
    desc: "Every task carries a status, priority, due date, and an assignee — one who's actually assigned to that project, enforced server-side, not just by the UI.",
  },
  {
    icon: FolderClosed,
    title: "Files, scoped per project",
    desc: "Uploads live in Cloudinary but are only ever visible to the people on that specific project. Not the org. Not other clients. That project.",
  },
  {
    icon: Activity,
    title: "An activity timeline that isn't manual",
    desc: "Uploads, comments, task completions — the timeline is generated from real actions as they happen, not typed up by someone after the fact.",
  },
  {
    icon: BellRing,
    title: "Notifications from the same source",
    desc: "Email notifications fire off that same activity stream. One event, one source of truth, two outputs — never two systems drifting apart.",
  },
  {
    icon: LayoutDashboard,
    title: "A dashboard with real signal",
    desc: "Health indicators computed from overdue tasks and last activity per project. Not a decorative counter that's always green.",
  },
  {
    icon: Search,
    title: "Search that's backend-driven",
    desc: "Indexed search and filtering across tasks and projects — built for when a small agency's client list stops fitting on one screen.",
  },
  {
    icon: ShieldCheck,
    title: "Access that's actually enforced",
    desc: "Owner, team member, client — each one is scoped in the database, not just hidden in the UI. Try the wrong URL and you get denied, not an empty page.",
  },
];

export function FeatureWalkthrough() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.utils.toArray<HTMLElement>(".feature-row").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 32,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="features" ref={rootRef} className="bg-ink px-6 py-28 text-paper">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-gold">
          What Ledger actually does
        </p>
        <h2 className="mt-4 font-display text-3xl italic text-paper md:text-4xl">
          Everything client work needs. Nothing it doesn&apos;t.
        </h2>

        <div className="mt-16 flex flex-col divide-y divide-paper/10">
          {features.map((f) => (
            <div
              key={f.title}
              className="feature-row flex items-start gap-5 py-8"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-paper/20">
                <f.icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-lg text-paper">{f.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/60">
                  {f.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
