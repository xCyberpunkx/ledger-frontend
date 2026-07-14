"use client";

import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { FolderKanban } from "lucide-react";
import { InvitePanel } from "@/components/dashboard/InvitePanel";

type Organization = {
  id: string;
  name: string;
  slug: string;
  memberships: { role: "OWNER" | "ADMIN" | "MEMBER" }[];
};

export default function OrgPage({ params }: { params: { slug: string } }) {
  const { getToken } = useAuth();

  // Same queryKey the dashboard list page and OrgSwitcher already use —
  // looking the org up by slug client-side against that shared cache,
  // instead of adding a GET /organizations/by-slug/:slug backend route,
  // keeps one source of truth for "which orgs am I in" instead of two
  // slightly different ways of asking the same question.
  const { data: orgs, isPending, error } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Organization[]>("/organizations", token);
    },
  });

  const org = orgs?.find((o) => o.slug === params.slug);

  if (isPending) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="h-8 w-56 animate-pulse rounded bg-border" />
        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-border/70" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 text-sm text-ink">
          Couldn&apos;t load this organization. Try refreshing.
        </div>
      </div>
    );
  }

  // "Not found" here means one of two things — the slug doesn't exist,
  // or it does and you're just not a member — and deliberately doesn't
  // say which. Same reasoning as OrgRoleGuard's 403 on the backend:
  // distinguishing the two would confirm which orgs exist to someone
  // probing URLs.
  if (!org) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-display text-2xl italic text-ink">Not found</p>
        <p className="mt-2 text-sm text-muted">
          Either this organization doesn&apos;t exist, or you&apos;re not a member of it.
        </p>
      </div>
    );
  }

  const role = org.memberships[0]?.role;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-display-sm text-ink">{org.name}</h1>
        <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
          {role}
        </span>
      </div>
      <p className="mt-1 font-mono text-xs text-muted">{org.slug}</p>

      <div className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-moss/10">
          <FolderKanban className="h-6 w-6 text-moss" />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Projects will live here. That&apos;s V2 — clients and projects
          haven&apos;t been built yet.
        </p>
      </div>

      {(role === "OWNER" || role === "ADMIN") && (
        <InvitePanel organizationId={org.id} />
      )}
    </div>
  );
}
