"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, FileUp, Lock, MessageSquare } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// --- Visual 1: the kanban board -------------------------------------------
// Real Ledger status columns, not a generic three-box placeholder — the
// column names and card content match what TASK-02 actually ships.
function KanbanVisual() {
  const columns = [
    {
      name: "To do",
      cards: ["Draft homepage copy", "Source hero photography"],
    },
    {
      name: "In progress",
      cards: ["Build client portal auth"],
    },
    {
      name: "Done",
      cards: ["Kickoff call notes", "Brand color palette"],
    },
  ];

  return (
    <div className="showcase-visual overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-card">
      <div className="grid grid-cols-3 gap-3">
        {columns.map((col) => (
          <div key={col.name}>
            <p className="font-mono text-[10px] uppercase tracking-widest text-muted">
              {col.name}
            </p>
            <div className="mt-2 flex flex-col gap-2">
              {col.cards.map((card) => (
                <div
                  key={card}
                  className="kanban-card rounded-lg border border-border bg-paper-dim/60 p-2.5 text-[11px] leading-snug text-ink"
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Visual 2: the client portal boundary -----------------------------
// The point isn't "here's a portal," it's "here's exactly where the
// boundary sits" — so the visual dramatizes what a client can and can't
// reach, not just a pretty screenshot.
function PortalVisual() {
  return (
    <div className="showcase-visual overflow-hidden rounded-2xl border border-border bg-white shadow-card">
      <div className="flex items-center gap-1.5 border-b border-border bg-paper-dim px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="h-2 w-2 rounded-full bg-border" />
        <span className="ml-2 font-mono text-[10px] text-muted">portal.ledger.dev/alder-studio</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between rounded-lg border border-moss/30 bg-moss/[0.06] px-3 py-2">
          <span className="text-xs font-medium text-ink">Alder Studio — Site rebuild</span>
          <span className="rounded-full bg-moss/10 px-2 py-0.5 text-[10px] font-semibold text-moss">
            your project
          </span>
        </div>
        <div className="portal-locked mt-2 flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 opacity-50">
          <span className="text-xs text-muted">Northwind — Brand refresh</span>
          <Lock className="h-3.5 w-3.5 text-muted" />
        </div>
        <div className="portal-locked mt-2 flex items-center justify-between rounded-lg border border-dashed border-border px-3 py-2 opacity-50">
          <span className="text-xs text-muted">Moss &amp; Co — Q3 campaign</span>
          <Lock className="h-3.5 w-3.5 text-muted" />
        </div>
      </div>
    </div>
  );
}

// --- Visual 3: the activity timeline -----------------------------------
// One append-only stream feeding both the UI and email — the visual shows
// three different event *types* landing in the same feed, which is the
// actual architectural point (ActivityEvent, one source, two outputs).
function TimelineVisual() {
  const events = [
    { icon: CheckCircle2, color: "text-moss", text: "Sana marked \u201cExport final logo files\u201d done", time: "2m ago" },
    { icon: FileUp, color: "text-gold", text: "Client uploaded brand_assets_v2.zip", time: "1h ago" },
    { icon: MessageSquare, color: "text-ink", text: "Zine commented on the homepage draft", time: "3h ago" },
  ];

  return (
    <div className="showcase-visual rounded-2xl border border-border bg-white p-5 shadow-card">
      <div className="flex flex-col gap-4">
        {events.map((e, i) => (
          <div key={e.text} className="timeline-row flex gap-3">
            <div className="flex flex-col items-center">
              <e.icon className={`h-4 w-4 ${e.color}`} />
              {i < events.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-border" />}
            </div>
            <div className="pb-2">
              <p className="text-xs leading-snug text-ink">{e.text}</p>
              <p className="mt-0.5 font-mono text-[10px] text-muted">{e.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const showcases = [
  {
    eyebrow: "Projects & tasks",
    headline: "One board, not five spreadsheets",
    body: "Kanban or list, every task carries a status, a priority, a due date, and an assignee — one who's actually assigned to that project, checked server-side, not just hidden in the UI.",
    Visual: KanbanVisual,
  },
  {
    eyebrow: "Client portal",
    headline: "Clients see their project. Nothing else.",
    body: "A client invited into the portal gets exactly their own project — progress, files, milestones, a place to comment. Not the org's other clients. Not internal-only tasks. The boundary is enforced in the database, not painted over in the UI.",
    Visual: PortalVisual,
  },
  {
    eyebrow: "Activity timeline",
    headline: "The truth, generated, not typed",
    body: "A file upload, a finished task, a new comment — every real action writes one event. That single stream powers the timeline you see and the email notification that lands seconds later. One source, never two systems drifting apart.",
    Visual: TimelineVisual,
  },
];

export function ProductShowcase() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".showcase-row").forEach((row) => {
        gsap.from(row.querySelectorAll(".showcase-copy > *"), {
          opacity: 0,
          y: 20,
          stagger: 0.08,
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 75%", toggleActions: "play none none reverse" },
        });
        gsap.from(row.querySelector(".showcase-visual"), {
          opacity: 0,
          y: 32,
          scale: 0.97,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: { trigger: row, start: "top 75%", toggleActions: "play none none reverse" },
        });
      });

      // Per-visual detail beats, so each showcase reads as its own small
      // moment rather than a static screenshot with a fade-in.
      gsap.from(".kanban-card", {
        opacity: 0,
        y: 10,
        stagger: 0.06,
        duration: 0.4,
        scrollTrigger: { trigger: ".kanban-card", start: "top 80%", toggleActions: "play none none reverse" },
      });
      gsap.from(".portal-locked", {
        opacity: 0,
        x: 12,
        stagger: 0.1,
        duration: 0.4,
        delay: 0.2,
        scrollTrigger: { trigger: ".portal-locked", start: "top 80%", toggleActions: "play none none reverse" },
      });
      gsap.from(".timeline-row", {
        opacity: 0,
        x: -10,
        stagger: 0.12,
        duration: 0.4,
        scrollTrigger: { trigger: ".timeline-row", start: "top 80%", toggleActions: "play none none reverse" },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="mx-auto max-w-5xl px-6 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Inside Ledger</p>
        <h2 className="mt-4 font-display text-3xl italic text-ink md:text-4xl">
          Built for the work, not the demo
        </h2>
      </div>

      <div className="mt-20 flex flex-col gap-24">
        {showcases.map((s, i) => (
          <div
            key={s.headline}
            className={`showcase-row grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div className="showcase-copy">
              <p className="font-mono text-xs uppercase tracking-widest text-gold">{s.eyebrow}</p>
              <h3 className="mt-3 font-display text-2xl text-ink md:text-display-sm">{s.headline}</h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{s.body}</p>
            </div>
            <s.Visual />
          </div>
        ))}
      </div>
    </section>
  );
}
