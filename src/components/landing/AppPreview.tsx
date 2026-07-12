"use client";

import { Building2, CheckCircle2, Circle, CircleDot, Search } from "lucide-react";

// This is a real depiction of Ledger's actual UI concepts — org switcher,
// project health computed from overdue tasks (not a decorative badge),
// a task row with status/assignee — not a stock "AI SaaS dashboard"
// image. Static markup here; Hero.tsx handles the entrance/parallax
// motion so this component stays a pure, testable presentation piece.
const projects = [
  { name: "Northwind — Brand refresh", health: "on-track", tasks: "12 open" },
  { name: "Alder Studio — Site rebuild", health: "at-risk", tasks: "4 overdue" },
  { name: "Moss & Co — Q3 campaign", health: "on-track", tasks: "7 open" },
];

const tasks = [
  { title: "Export final logo files", status: "done", assignee: "SK" },
  { title: "Client review — homepage copy", status: "in-review", assignee: "ZE" },
  { title: "Fix mobile nav breakpoint", status: "in-progress", assignee: "ZE" },
];

const healthColor: Record<string, string> = {
  "on-track": "bg-moss",
  "at-risk": "bg-gold",
};

const statusIcon: Record<string, JSX.Element> = {
  done: <CheckCircle2 className="h-3.5 w-3.5 text-moss" />,
  "in-review": <CircleDot className="h-3.5 w-3.5 text-gold" />,
  "in-progress": <Circle className="h-3.5 w-3.5 text-muted" />,
};

export function AppPreview() {
  return (
    <div className="app-preview relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-border bg-white shadow-lifted">
      {/* window chrome — grounds this as "an application," not a poster */}
      <div className="flex items-center gap-1.5 border-b border-border bg-paper-dim px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <span className="h-2.5 w-2.5 rounded-full bg-border" />
        <div className="ml-3 flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-muted">
          <Search className="h-3 w-3" /> app.ledger.dev/northwind
        </div>
      </div>

      <div className="flex min-h-[360px]">
        {/* sidebar */}
        <aside className="hidden w-52 shrink-0 flex-col border-r border-border bg-paper-dim p-4 sm:flex">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2 shadow-soft">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-moss/10">
              <Building2 className="h-3.5 w-3.5 text-moss" />
            </div>
            <span className="text-xs font-semibold text-ink">Northwind Studio</span>
          </div>
          <nav className="mt-6 flex flex-col gap-1 text-xs font-medium text-muted">
            <span className="rounded-lg bg-white px-3 py-2 text-ink shadow-soft">Projects</span>
            <span className="px-3 py-2">Clients</span>
            <span className="px-3 py-2">Team</span>
            <span className="px-3 py-2">Activity</span>
          </nav>
        </aside>

        {/* main */}
        <div className="flex-1 p-5">
          <p className="preview-line font-mono text-[10px] uppercase tracking-widest text-muted">
            Projects · 3 active
          </p>

          <div className="mt-3 flex flex-col gap-2">
            {projects.map((p) => (
              <div
                key={p.name}
                className="preview-line flex items-center justify-between rounded-xl border border-border bg-paper-dim/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`h-2 w-2 rounded-full ${healthColor[p.health]}`} />
                  <span className="text-xs font-medium text-ink">{p.name}</span>
                </div>
                <span className="text-[11px] text-muted">{p.tasks}</span>
              </div>
            ))}
          </div>

          <p className="preview-line mt-6 font-mono text-[10px] uppercase tracking-widest text-muted">
            Alder Studio — Site rebuild
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {tasks.map((t) => (
              <div
                key={t.title}
                className="preview-line flex items-center justify-between rounded-lg px-2 py-2 hover:bg-paper-dim/60"
              >
                <div className="flex items-center gap-2.5">
                  {statusIcon[t.status]}
                  <span className="text-xs text-ink">{t.title}</span>
                </div>
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink text-[9px] font-semibold text-paper">
                  {t.assignee}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
