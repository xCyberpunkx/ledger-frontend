import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "Terms of Service — Ledger",
};

export default function TermsPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Legal</p>
        <h1 className="mt-4 font-display text-4xl italic text-ink">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted">Last updated July 2026.</p>

        <div className="mt-10 flex flex-col gap-8 text-sm leading-relaxed text-ink/80">
          <p className="rounded-xl border border-gold/40 bg-gold/10 p-4 text-ink">
            Ledger is currently in active development (beta). Features described
            on this site may change, and the service is not yet warrantied for
            production business use. See the{" "}
            <a href="/changelog" className="underline underline-offset-4">changelog</a>{" "}
            for current status.
          </p>

          <div>
            <h2 className="font-display text-lg text-ink">1. Acceptance of terms</h2>
            <p className="mt-2">
              By creating an account or using Ledger, you agree to these terms. If
              you don&apos;t agree, don&apos;t use the service.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">2. The service</h2>
            <p className="mt-2">
              Ledger is a client and project operations platform for freelancers
              and small agencies. We reserve the right to modify, suspend, or
              discontinue any part of the service, especially during this beta
              period, with reasonable notice where practical.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">3. Accounts</h2>
            <p className="mt-2">
              You&apos;re responsible for the activity that happens under your
              account. Authentication is handled by Clerk; keep your credentials
              and connected sign-in methods secure.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">4. Acceptable use</h2>
            <p className="mt-2">
              Don&apos;t use Ledger to store or transmit unlawful content, attempt
              to breach other organizations&apos; data, or interfere with the
              service&apos;s normal operation.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">5. Your data</h2>
            <p className="mt-2">
              You own the client, project, and file data you put into Ledger. We
              don&apos;t claim ownership of it and don&apos;t sell it. See the{" "}
              <a href="/privacy" className="underline underline-offset-4">
                Privacy Policy
              </a>{" "}
              for how it&apos;s handled.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">6. Termination</h2>
            <p className="mt-2">
              You can delete your account and organization data at any time. We
              may suspend accounts that violate these terms.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">7. Disclaimer &amp; liability</h2>
            <p className="mt-2">
              The service is provided &quot;as is&quot; during this beta period,
              without warranties of any kind. Ledger&apos;s liability for any claim
              is limited to the amount you&apos;ve paid us in the preceding 12
              months, if any.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">8. Changes</h2>
            <p className="mt-2">
              We may update these terms as the product evolves. Material changes
              will be reflected here with an updated date.
            </p>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink">9. Contact</h2>
            <p className="mt-2">
              Questions about these terms:{" "}
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
