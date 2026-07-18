"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Pulled from ROADMAP.md and cross-checked against CONTEXT_RESUME.md —
// this section is a mirror, not a promise, so it needs to say what's
// actually true, not what the original roadmap draft assumed. V0–V3 are
// confirmed done (backend + frontend, tested). V4/V5 frontend components
// (FilesPanel, CommentsPanel, ActivityTimeline) already exist and are
// wired into the project page, even though the backend application code
// for those versions isn't confirmed complete — marked in-progress, not
// shipped, until that's verified. V7 (portal) has a working invite +
// accept flow as of this session — in-progress, not planned.
// UPDATE THIS FILE the next time a version's real status changes; don't
// let it drift back out of sync with what's actually built.
const milestones = [
  { version: "V0", title: "Foundation", status: "shipped", detail: "Repos, full schema, Docker, health check, CI." },
  { version: "V1", title: "Auth & organization core", status: "shipped", detail: "Clerk auth, org creation, role guards, cross-org isolation tested." },
  { version: "V2", title: "Clients & projects", status: "shipped", detail: "Client CRUD, project scoping by assignment." },
  { version: "V3", title: "Tasks & milestones", status: "shipped", detail: "Kanban, list view, status filters." },
  { version: "V4", title: "Files & comments", status: "in-progress", detail: "Cloudinary uploads and comment threads, scoped per project." },
  { version: "V5", title: "Activity & notifications", status: "in-progress", detail: "Timeline and email off one event stream." },
  { version: "V6", title: "Dashboard & search", status: "planned", detail: "Real health indicators, indexed search." },
  { version: "V7", title: "Client portal", status: "in-progress", detail: "Token invite, sandboxed client-facing UI." },
  { version: "V8", title: "Production polish", status: "planned", detail: "Dark mode, Sentry, Playwright, deploy." },
];

const statusStyle: Record<string, string> = {
  shipped: "bg-moss text-paper",
  "in-progress": "bg-gold text-ink",
  planned: "border border-border text-muted",
};

const statusLabel: Record<string, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  planned: "Planned",
};

export function RoadmapSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) return;

      gsap.from(".roadmap-row", {
        opacity: 0,
        x: -16,
        stagger: 0.06,
        duration: 0.45,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="roadmap" className="mx-auto max-w-3xl px-6 py-28">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Roadmap</p>
        <h2 className="mt-4 font-display text-3xl italic text-ink md:text-4xl">
          Shipped in the open, one slice at a time
        </h2>
        <p className="mt-3 text-sm text-muted">
          Every version is demoable end to end — never a half-wired feature.
        </p>
      </div>

      <div className="mt-14 flex flex-col divide-y divide-border">
        {milestones.map((m) => (
          <div key={m.version} className="roadmap-row flex items-center gap-5 py-4">
            <span className="w-8 shrink-0 font-mono text-xs text-muted">{m.version}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{m.title}</p>
              <p className="mt-0.5 text-xs text-muted">{m.detail}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyle[m.status]}`}>
              {statusLabel[m.status]}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
