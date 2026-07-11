const personas = [
  {
    role: "Owner",
    color: "bg-primary",
    sees: "Every client, every project, every teammate — the whole org.",
  },
  {
    role: "Team member",
    color: "bg-pink",
    sees: "Only the projects they're assigned to. Nothing else in the org.",
  },
  {
    role: "Client",
    color: "bg-ink",
    sees: "Their own project, sandboxed. No other clients, no internal tasks.",
  },
];

export function Personas() {
  return (
    <section id="personas" className="mx-auto max-w-6xl px-6 py-24">
      <div className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-3xl font-extrabold tracking-tight">
          Three people, three views, one project
        </h2>
        <p className="mt-3 text-muted">
          Nobody sees more than they should — that&apos;s enforced, not just promised.
        </p>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {personas.map((p) => (
          <div
            key={p.role}
            className="rounded-3xl border border-border bg-surface-soft p-6 transition hover:shadow-lg hover:shadow-ink/5"
          >
            <span className={`inline-block h-9 w-9 rounded-xl ${p.color}`} />
            <h3 className="mt-4 font-display text-lg font-bold">{p.role}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{p.sees}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
