import type { Metadata } from "next";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const metadata: Metadata = {
  title: "About — Ledger",
  description: "Why Ledger exists, and who's building it.",
};

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <section className="mx-auto max-w-2xl px-6 py-24">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">About</p>
        <h1 className="mt-4 font-display text-4xl italic text-ink">
          Why this exists
        </h1>

        <div className="mt-10 flex flex-col gap-6 text-base leading-relaxed text-ink/80">
          <p>
            Ledger started from a simple observation: small agencies and freelancers
            run real client work through WhatsApp threads, email chains, and
            spreadsheets that all quietly disagree with each other. Nobody designed
            it that way — it just accumulates, tool by tool, until status lives
            in five places and none of them are the truth.
          </p>
          <p>
            I&apos;m Zine Eddine Rouabah, a software engineer based in Algeria. I&apos;d
            been building web applications professionally for a few years —
            Next.js, Laravel, full-stack work for real clients — when I lost my job.
            Rather than treat that as a setback to wait out, I decided to build
            something real: not a tutorial project, not a clone, but a product with
            an actual domain model, actual tenant isolation, actually deployed.
          </p>
          <p>
            Ledger is that project. It&apos;s built in the open, one versioned
            release at a time — see the{" "}
            <a href="/changelog" className="text-moss underline underline-offset-4">
              changelog
            </a>{" "}
            for exactly what&apos;s shipped and what&apos;s next. No unfinished pages,
            no fake data pretending to be a real dashboard.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-4 border-t border-border pt-8 text-sm">
          <a
            href="https://zineddine.vercel.app"
            className="text-moss underline underline-offset-4"
          >
            Portfolio
          </a>
          <a
            href="https://github.com/xCyberpunkx"
            className="text-moss underline underline-offset-4"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/zine-eddine-rouabah/"
            className="text-moss underline underline-offset-4"
          >
            LinkedIn
          </a>
        </div>
      </section>
      <Footer />
    </main>
  );
}
