import {
  LayoutDashboard,
  KanbanSquare,
  FolderClosed,
  BellRing,
  Activity,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: KanbanSquare,
    title: "Kanban & list views",
    desc: "Tasks with status, priority, and due dates — switch views without switching tools.",
  },
  {
    icon: FolderClosed,
    title: "Files, scoped per project",
    desc: "Uploads are visible only to the people on that project. Nobody sees another client's folder by accident.",
  },
  {
    icon: Activity,
    title: "Activity timeline",
    desc: "Generated automatically from real actions — uploads, comments, completions. Nobody logs it by hand.",
  },
  {
    icon: BellRing,
    title: "Notifications that make sense",
    desc: "Emails fire off the same activity stream as the timeline. One source, not two systems to keep in sync.",
  },
  {
    icon: LayoutDashboard,
    title: "A dashboard that means it",
    desc: "Health indicators computed from overdue tasks and last activity — not decorative counters.",
  },
  {
    icon: ShieldCheck,
    title: "Access that's actually enforced",
    desc: "Every role — owner, team member, client — sees exactly their slice. Nothing else.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-surface-soft px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight">
            Everything client work actually needs
          </h2>
          <p className="mt-3 text-muted">Nothing it doesn&apos;t.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-3xl border border-border bg-white p-6 transition hover:shadow-lg hover:shadow-ink/5"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-display text-base font-bold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
