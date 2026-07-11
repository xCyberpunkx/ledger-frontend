const sidebarClients = ["Halden Retail", "Voss Studio", "Marsh & Co.", "Ferro Group"];

const columns = [
  { label: "To do", dot: "bg-muted/30", cards: ["Homepage copy", "Asset review"] },
  { label: "In progress", dot: "bg-primary", cards: ["Client portal QA"] },
  { label: "Done", dot: "bg-pink", cards: ["Kickoff deck", "Brand assets"] },
];

// No "use client" — this is static markup, no interactivity, so it stays
// a Server Component and ships zero JS.
export function ProductPreview() {
  return (
    <section className="relative px-6 pb-24">
      <div className="relative mx-auto max-w-5xl">
        <div className="rounded-4xl border border-border bg-surface p-3 shadow-2xl shadow-ink/10">
          <div className="flex items-center gap-1.5 px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <div className="grid grid-cols-[180px_1fr] gap-4 rounded-3xl bg-surface-soft p-4">
            <div className="hidden flex-col gap-2 md:flex">
              {sidebarClients.map((c, i) => (
                <div
                  key={c}
                  className={`rounded-xl px-3 py-2 text-xs font-medium ${
                    i === 0 ? "bg-primary text-white" : "text-muted hover:bg-white"
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {columns.map((col) => (
                <div key={col.label} className="rounded-2xl bg-white p-3 shadow-sm">
                  <div className="mb-2 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-semibold text-ink">{col.label}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {col.cards.map((card) => (
                      <div
                        key={card}
                        className="rounded-lg border border-border px-2.5 py-2 text-xs text-muted"
                      >
                        {card}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
