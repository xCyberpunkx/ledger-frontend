import Link from "next/link";
import { Github } from "lucide-react";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Security", href: "/#security" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Roadmap", href: "/#roadmap" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    heading: "Developers",
    links: [
      { label: "GitHub", href: "https://github.com", external: true },
      { label: "API reference", href: "/#developers" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const focusRing =
  "rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5">
          <div className="md:col-span-1">
            <span className="font-display text-xl italic text-ink">Ledger</span>
            <p className="mt-3 max-w-[20ch] text-sm leading-relaxed text-muted">
              One true status for every client project.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Ledger on GitHub"
              className={`mt-4 inline-flex text-muted hover:text-ink ${focusRing}`}
            >
              <Github className="h-4 w-4" />
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.heading}>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{col.heading}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((l) =>
                  "external" in l && l.external ? (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-sm text-muted hover:text-ink ${focusRing}`}
                      >
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.label}>
                      <Link href={l.href} className={`text-sm text-muted hover:text-ink ${focusRing}`}>
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
          <span>&copy; {new Date().getFullYear()} Ledger. MIT licensed.</span>
          <span>Built by Zine Eddine.</span>
        </div>
      </div>
    </footer>
  );
}
