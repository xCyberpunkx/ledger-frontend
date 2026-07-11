const ledgerRows = [
  { client: "Marsh & Co.", status: "On track", updated: "2h ago", stamped: false },
  { client: "Voss Studio", status: "Needs input", updated: "1d ago", stamped: false },
  { client: "Halden Retail", status: "Delivered", updated: "Just now", stamped: true },
  { client: "Ferro Group", status: "At risk", updated: "3d ago", stamped: false },
];

const chaosInputs = [
  "17 unread WhatsApp messages",
  "\u201cquick question\u201d email thread, 43 replies deep",
  "Status_FINAL_v3.xlsx",
  "Drive folder shared with the wrong client",
];

const personas = [
  {
    n: "01",
    role: "Owner",
    sees: "Every client, every project, every teammate, org-wide.",
  },
  {
    n: "02",
    role: "Team member",
    sees: "Only the projects they're assigned to \u2014 nothing else in the org.",
  },
  {
    n: "03",
    role: "Client",
    sees: "Their own project, scoped and sandboxed, nothing about anyone else's.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-display text-lg font-bold tracking-tight">Ledger</span>
        <a
          href="#personas"
          className="font-mono text-xs uppercase tracking-widest text-paper/60 transition hover:text-paper"
        >
          How it works
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl gap-14 px-6 pb-24 pt-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-seal">
            Client &amp; project operations
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            Status stops living in five places that disagree with each other.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-paper/70">
            Ledger centralizes client work at the boundary that actually matters: your team
            does the real work, and the system produces one true record of status &mdash; shown
            automatically to the right person, instead of relayed by hand.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <button className="rounded-sm bg-seal px-5 py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-seal/80">
              Get started
            </button>
            <button className="font-mono text-xs uppercase tracking-widest text-paper/60 underline underline-offset-4 transition hover:text-paper">
              See a project
            </button>
          </div>
        </div>

        {/* Signature element: an actual ledger sheet */}
        <div className="rounded-sm border border-line bg-ink/40 p-1">
          <div className="rounded-sm border border-line/60 p-5">
            <div className="mb-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-paper/40">
              <span>Project ledger</span>
              <span>Live</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-6 gap-y-3 font-mono text-sm">
              <span className="text-paper/40">Client</span>
              <span className="text-paper/40">Status</span>
              <span className="text-right text-paper/40">Updated</span>
              {ledgerRows.map((row) => (
                <div key={row.client} className="contents">
                  <span
                    className={`border-t border-line/60 py-2 ${
                      row.stamped ? "text-paper" : "text-paper/80"
                    }`}
                  >
                    {row.client}
                  </span>
                  <span className="relative flex items-center border-t border-line/60 py-2">
                    {row.status}
                    {row.stamped && (
                      <span className="ml-2 rotate-[-6deg] rounded-sm border border-gold px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-gold">
                        Stamped
                      </span>
                    )}
                  </span>
                  <span className="border-t border-line/60 py-2 text-right text-paper/50">
                    {row.updated}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-y border-line bg-ink/60">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="font-mono text-xs uppercase tracking-widest text-paper/40">
            Before Ledger
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {chaosInputs.map((item) => (
              <span
                key={item}
                className="rounded-sm border border-line px-3 py-2 font-mono text-xs text-paper/60"
              >
                {item}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-lg text-sm text-paper/50">
            None of it agrees with the others, and someone has to relay all of it to the
            client by hand, again, this week.
          </p>
        </div>
      </section>

      {/* Personas — a real hierarchy, numbering earns its place here */}
      <section id="personas" className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="font-display text-2xl font-bold tracking-tight">
          Three people, three views, one project
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {personas.map((p) => (
            <div key={p.role} className="border-t border-line pt-4">
              <span className="font-mono text-xs text-seal">{p.n}</span>
              <h3 className="mt-2 font-display text-lg font-bold">{p.role}</h3>
              <p className="mt-2 text-sm leading-relaxed text-paper/60">{p.sees}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-16 md:flex-row md:items-center">
          <p className="font-display text-xl font-bold tracking-tight">
            Run client work like it's written down once.
          </p>
          <button className="rounded-sm bg-seal px-5 py-3 font-mono text-xs uppercase tracking-widest text-paper transition hover:bg-seal/80">
            Get started
          </button>
        </div>
      </footer>
    </main>
  );
}
