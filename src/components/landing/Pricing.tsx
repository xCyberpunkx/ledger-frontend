"use client";

import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";

// Price removed from Team/Agency — sales-assisted for those two, not
// self-serve checkout (nothing wires to a payment provider yet, and
// pretending there's a fixed DZD/EUR/USD price before that decision is
// made is exactly the premature-commitment CONTEXT_RESUME.md flags for
// currency). Solo stays a real, checkable "Free" claim — it costs
// nothing to sign up for, so that one tag isn't speculative.
const tiers = [
  {
    name: "Solo",
    price: "Free",
    period: "forever",
    tagline: "For freelancers running one or two clients.",
    features: ["1 client", "3 active projects", "Kanban & list views", "File uploads"],
    highlighted: false,
    cta: "self-serve" as const,
  },
  {
    name: "Team",
    tagline: "For small agencies with a team to coordinate.",
    features: [
      "Unlimited clients & projects",
      "Team members & role-based access",
      "Activity timeline",
      "Email notifications",
    ],
    highlighted: true,
    cta: "sales" as const,
  },
  {
    name: "Agency",
    tagline: "For agencies ready to bring clients into the loop.",
    features: [
      "Everything in Team",
      "Client portal invites",
      "Project health dashboard",
      "Priority support",
    ],
    highlighted: false,
    cta: "sales" as const,
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Pricing</p>
        <h2 className="mt-4 font-display text-3xl italic text-ink">
          {`Start free. Talk to us when you're ready to grow.`}
        </h2>
        <p className="mt-3 text-muted">
          Solo is free, no card required. Team and Agency are sized to how your studio actually works.
        </p>
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl border p-7 ${
              tier.highlighted
                ? "border-ink bg-ink text-paper"
                : "border-border bg-paper-dim/40"
            }`}
          >
            {tier.highlighted && (
              <span className="absolute -top-3 left-6 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
                Most popular
              </span>
            )}
            <h3 className="font-display text-lg italic">{tier.name}</h3>
            <p className={`mt-1 text-sm ${tier.highlighted ? "text-paper/60" : "text-muted"}`}>
              {tier.tagline}
            </p>

            <div className="mt-6 flex items-baseline gap-1">
              {tier.cta === "self-serve" ? (
                <>
                  <span className="font-display text-3xl">{tier.price}</span>
                  <span className={tier.highlighted ? "text-paper/50" : "text-muted"}>
                    {tier.period}
                  </span>
                </>
              ) : (
                <span
                  className={`font-display text-xl italic ${
                    tier.highlighted ? "text-paper/70" : "text-muted"
                  }`}
                >
                  Let&apos;s talk pricing
                </span>
              )}
            </div>

            <ul className="mt-6 flex flex-col gap-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className={tier.highlighted ? "text-paper/80" : "text-muted"}>{f}</span>
                </li>
              ))}
            </ul>

            {tier.cta === "self-serve" ? (
              <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                <button
                  className={`mt-7 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition ${focusRing} ${
                    tier.highlighted
                      ? "bg-paper text-ink hover:bg-paper-dim focus-visible:ring-gold focus-visible:ring-offset-ink"
                      : "bg-ink text-paper hover:bg-moss-dark focus-visible:ring-moss focus-visible:ring-offset-paper"
                  }`}
                >
                  Get started
                </button>
              </SignUpButton>
            ) : (
              <Link
                href="/contact"
                className={`mt-7 flex w-full items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition ${focusRing} ${
                  tier.highlighted
                    ? "bg-paper text-ink hover:bg-paper-dim focus-visible:ring-gold focus-visible:ring-offset-ink"
                    : "bg-ink text-paper hover:bg-moss-dark focus-visible:ring-moss focus-visible:ring-offset-paper"
                }`}
              >
                Contact sales
              </Link>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
