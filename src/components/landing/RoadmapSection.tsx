"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Pulled directly from ROADMAP.md — do not embellish status here without
// updating that file first; this section is a mirror, not a promise.
const milestones = [
  { version: "V0", title: "Foundation", status: "shipped", detail: "Repos, full schema, Docker, health check, CI." },
  { version: "V1", title: "Auth & organization core", status: "in-progress", detail: "Clerk auth is live; org creation and role guards are next." },
  { version: "V2", title: "Clients & projects", status: "planned", detail: "Client CRUD, project scoping by assignment." },
  { version: "V3", title: "Tasks & milestones", status: "planned", detail: "Kanban, list view, drag-and-drop status." },
  { version: "V4", title: "Files & comments", status: "planned", detail: "Cloudinary uploads scoped per project." },
  { version: "V5", title: "Activity & notifications", status: "planned", detail: "Timeline and email off one event stream." },
  { version: "V6", title: "Dashboard & search", status: "planned", detail: "Real health indicators, indexed search." },
  { version: "V7", title: "Client portal", status: "planned", detail: "Token invite, sandboxed client-facing UI." },
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
