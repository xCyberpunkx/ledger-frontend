"use client";

import { useEffect, useRef } from "react";
import { KeyRound, ShieldCheck, XCircle } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const points = [
  {
    icon: KeyRound,
    title: "Clerk handles identity",
    body: "Sessions, JWTs, password resets, email verification — one battle-tested provider, not a hand-rolled auth system to audit.",
  },
  {
    icon: ShieldCheck,
    title: "Roles live on the membership",
    body: "Access isn't read off the JWT — it's checked against the Membership row for that specific organization, every request.",
  },
  {
    icon: XCircle,
    title: "Denied means denied",
    body: "Cross-tenant access returns 403 or 404, never an empty array. An empty list quietly confirms something exists; Ledger doesn't leak that.",
  },
];

export function SecuritySection() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".security-point", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      });

      gsap
        .timeline({
          scrollTrigger: { trigger: ".deny-demo", start: "top 75%", toggleActions: "play none none reverse" },
        })
        .from(".deny-request", { opacity: 0, x: -12, duration: 0.4 })
        .to(".deny-request", { opacity: 0.4, duration: 0.3 }, "+=0.3")
        .from(".deny-response", { opacity: 0, x: 12, duration: 0.4 }, "-=0.2");
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} id="security" className="mx-auto max-w-5xl px-6 py-28">
      <div className="grid items-center gap-14 md:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-moss">Security</p>
          <h2 className="mt-4 font-display text-3xl italic text-ink md:text-display-sm">
            Tenant isolation isn&apos;t a feature. It&apos;s the floor.
          </h2>

          <div className="mt-10 flex flex-col gap-7">
            {points.map((p) => (
              <div key={p.title} className="security-point flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border">
                  <p.icon className="h-4 w-4 text-moss" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-ink">{p.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* the "watch it deny access" moment, made concrete */}
        <div className="deny-demo overflow-hidden rounded-2xl border border-border bg-white p-5 font-mono text-xs shadow-card">
          <div className="deny-request rounded-lg bg-paper-dim p-3 text-ink">
            <span className="text-moss">GET</span> /organizations/org_2/members
            <div className="mt-1 text-muted">Authorization: Bearer &lt;org_1_member_token&gt;</div>
          </div>
          <div className="deny-response mt-3 rounded-lg bg-ink p-3 text-paper">
            <span className="text-gold">403</span> Forbidden
            <div className="mt-1 text-paper/50">{`{ "message": "Not a member of this organization" }`}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
