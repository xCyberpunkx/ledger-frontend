import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Ledger",
};

const processors = [
  ["Clerk", "Authentication, account & session management"],
  ["Neon (PostgreSQL)", "Primary database — organizations, projects, tasks, etc."],
  ["Cloudinary", "File & image storage for project uploads"],
  ["Resend", "Transactional email (notifications, invites)"],
  ["Vercel", "Frontend hosting"],
  ["Railway / Render", "Backend hosting"],
  ["Sentry", "Error monitoring — technical logs only, not your content"],
];

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Legal</p>
        <h1 className="mt-4 font-display text-4xl italic text-ink">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted">Last updated July 2026.</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink/80">
          <div>
            <h2 className="font-display text-lg text-ink">What we collect</h2>
            <p className="mt-2">
              Account info (name, email, profile image) via Clerk when you sign
              up. Organization, client, project, task, and file data you
              deliberately enter into Ledger. Standard technical logs (IP,
              browser, timestamps) for security and debugging.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">What we don&apos;t do</h2>
            <p className="mt-2">
              We don&apos;t sell your data. We don&apos;t show ads. We don&apos;t use
              your client/project content to train any model.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">Who processes it</h2>
            <p className="mt-2">
              Ledger runs on a small number of third-party services, each handling
              only what they need to:
            </p>
            <div className="mt-4 flex flex-col divide-y divide-border rounded-xl border border-border">
              {processors.map(([name, purpose]) => (
                <div key={name} className="flex justify-between gap-4 px-4 py-3">
                  <span className="font-medium text-ink">{name}</span>
                  <span className="text-right text-muted">{purpose}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">Data isolation</h2>
            <p className="mt-2">
              Every piece of data belongs to exactly one organization. Access is
              enforced at the database-query level, not just hidden in the
              interface — a team member or client account can only ever retrieve
              rows scoped to what they&apos;re actually a member of or assigned to.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">Your rights</h2>
            <p className="mt-2">
              You can request a copy of your data or full account deletion at any
              time by emailing us. Deleting your organization removes its data
              (cascading to projects, tasks, files, and comments within it).
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">Cookies</h2>
            <p className="mt-2">
              We use only the session cookies Clerk requires to keep you signed
              in. No third-party ad-tracking cookies.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">Contact</h2>
            <p className="mt-2">
              Privacy questions or data requests:{" "}
              <a href="mailto:rouabah.zineedinee@gmail.com" className="underline underline-offset-4">
                rouabah.zineedinee@gmail.com
              </a>
            </p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
