"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Who is Ledger for?",
    a: "Freelancers and small agencies running client work through scattered WhatsApp threads, email, and spreadsheets. If status lives in five places that disagree with each other, that's the problem Ledger centralizes.",
  },
  {
    q: "Is it open source?",
    a: "Yes — both repositories, frontend and backend, are public under an MIT license. No paid-only core, no source-available license games.",
  },
  {
    q: "How does client access work?",
    a: "A client starts as a contact record — name, email, company — with no login. Portal access is a separate, deliberate step: you send an invite, they accept it, and they land in a view scoped to exactly their own project. Nothing else in the org.",
  },
  {
    q: "How is data separated between clients and organizations?",
    a: "At the database level. Every project belongs to one organization and one client; a team member's project list is filtered to what they're assigned; access checks run against the Membership row, not just hidden in the UI. Cross-tenant requests are denied, not filtered client-side.",
  },
  {
    q: "What's the tech stack?",
    a: "Next.js and NestJS, TypeScript throughout, PostgreSQL via Prisma, Clerk for auth, Cloudinary for files, Resend for email. Full list is in the developer section above.",
  },
  {
    q: "Can I self-host it?",
    a: "Yes. It's two ordinary repos with a docker-compose for local Postgres — no proprietary infrastructure required to run it yourself.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-2xl px-6 py-28">
      <div className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-moss">FAQ</p>
        <h2 className="mt-4 font-display text-3xl italic text-ink md:text-4xl">
          Questions worth answering straight
        </h2>
      </div>

      <div className="mt-12 flex flex-col divide-y divide-border">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="text-sm font-medium text-ink">{item.q}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 text-muted transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-5 text-sm leading-relaxed text-muted">{item.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
