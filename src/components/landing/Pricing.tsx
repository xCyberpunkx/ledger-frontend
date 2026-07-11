"use client";

import { SignUpButton } from "@clerk/nextjs";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Solo",
    price: "0 DZD",
    period: "forever",
    tagline: "For freelancers running one or two clients.",
    features: ["1 client", "3 active projects", "Kanban & list views", "File uploads"],
    highlighted: false,
  },
  {
    name: "Team",
    price: "2,900 DZD",
    period: "/mo",
    tagline: "For small agencies with a team to coordinate.",
    features: [
      "Unlimited clients & projects",
      "Team members & role-based access",
      "Activity timeline",
      "Email notifications",
    ],
    highlighted: true,
  },
  {
    name: "Agency",
    price: "6,900 DZD",
    period: "/mo",
    tagline: "For agencies ready to bring clients into the loop.",
    features: [
      "Everything in Team",
      "Client portal invites",
      "Project health dashboard",
      "Priority support",
    ],
    highlighted: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-28">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">Pricing</p>
        <h2 className="mt-4 font-display text-3xl italic text-ink">
          Simple pricing, no surprises
        </h2>
        <p className="mt-3 text-muted">Start free. Upgrade when the team does.</p>
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
              <span className="font-display text-3xl">{tier.price}</span>
              <span className={tier.highlighted ? "text-paper/50" : "text-muted"}>
                {tier.period}
              </span>
            </div>
            <ul className="mt-6 flex flex-col gap-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span className={tier.highlighted ? "text-paper/80" : "text-muted"}>{f}</span>
                </li>
              ))}
            </ul>
            <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
              <button
                className={`mt-7 w-full rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  tier.highlighted
                    ? "bg-paper text-ink hover:bg-paper-dim"
                    : "bg-ink text-paper hover:bg-moss-dark"
                }`}
              >
                Get started
              </button>
            </SignUpButton>
          </div>
        ))}
      </div>
    </section>
  );
}
