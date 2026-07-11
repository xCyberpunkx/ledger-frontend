import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Changelog — Ledger",
  description: "What's shipped, and what's next, version by version.",
};

const versions = [
  {
    tag: "V0",
    title: "Foundation",
    status: "shipped" as const,
    items: [
      "Two-repo setup: NestJS + Prisma backend, Next.js frontend",
      "Full domain schema — organizations, clients, projects, tasks, and more",
      "Local Postgres via Docker, health check endpoint",
    ],
  },
  {
    tag: "V1",
    title: "Auth & organization core",
    status: "in-progress" as const,
    items: [
      "Authentication via Clerk",
      "Create an organization — creator becomes Owner",
      "Org-scoped role guard (Owner / Admin / Member)",
      "Cross-org isolation tests",
    ],
  },
  {
    tag: "V2",
    title: "Clients & projects",
    status: "planned" as const,
    items: [
      "Client records",
      "Projects, scoped to a client and assigned team members",
    ],
  },
  {
    tag: "V3",
    title: "Tasks & milestones",
    status: "planned" as const,
    items: ["Kanban + list views", "Milestones grouping tasks"],
  },
  {
    tag: "V4",
    title: "Files & comments",
    status: "planned" as const,
    items: ["Project-scoped file uploads", "Comments on tasks, files, projects"],
  },
  {
    tag: "V5",
    title: "Activity & notifications",
    status: "planned" as const,
    items: ["Auto-generated activity timeline", "Email notifications from the same events"],
  },
  {
    tag: "V6",
    title: "Dashboard & search",
    status: "planned" as const,
    items: ["Real project health indicators", "Indexed search & filtering"],
  },
  {
    tag: "V7",
    title: "Client portal",
    status: "planned" as const,
    items: ["Token-based client invites", "Sandboxed client-facing views"],
  },
  {
    tag: "V8",
    title: "Production polish",
    status: "planned" as const,
    items: ["Dark mode", "Monitoring", "Deployed with a custom domain"],
  },
];

const statusStyles = {
  shipped: "bg-moss text-paper",
  "in-progress": "bg-gold text-ink",
  planned: "border border-border text-muted",
};

const statusLabel = {
  shipped: "Shipped",
  "in-progress": "In progress",
  planned: "Planned",
};

export default function ChangelogPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Changelog</p>
        <h1 className="mt-4 font-display text-4xl italic text-ink">
          Built one version at a time
        </h1>
        <p className="mt-4 text-muted">
          No unfinished pages pretending to be done. Here&apos;s exactly what&apos;s real
          right now, and what&apos;s coming next.
        </p>

        <div className="mt-14 flex flex-col divide-y divide-border">
          {versions.map((v) => (
            <div key={v.tag} className="py-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-muted">{v.tag}</span>
                <h2 className="font-display text-xl text-ink">{v.title}</h2>
                <span
                  className={`ml-auto rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[v.status]}`}
                >
                  {statusLabel[v.status]}
                </span>
              </div>
              <ul className="mt-3 flex flex-col gap-1.5 pl-1 text-sm text-muted">
                {v.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-gold">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  );
}
