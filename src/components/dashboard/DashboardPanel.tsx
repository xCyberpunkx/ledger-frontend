"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Gauge, AlertTriangle, Clock } from "lucide-react";

type ProjectHealth = {
  id: string;
  name: string;
  client: { id: string; name: string };
  overdueTaskCount: number;
  lastActivityAt: string | null;
  isStale: boolean;
  isAtRisk: boolean;
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "No activity yet";
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (days <= 0) return "Active today";
  if (days === 1) return "Active yesterday";
  return `Active ${days}d ago`;
}

// Same visible-project set as ProjectsPanel — OWNER/ADMIN sees every
// project's health, MEMBER sees only what they're assigned to. This
// panel is a different view of that list, not a different permission.
export function DashboardPanel({
  organizationId,
  slug,
}: {
  organizationId: string;
  slug: string;
}) {
  const { getToken } = useAuth();

  const { data: health, isPending } = useQuery({
    queryKey: ["dashboard", organizationId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<ProjectHealth[]>(
        `/organizations/${organizationId}/dashboard`,
        token,
      );
    },
  });

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-moss" />
        <h2 className="text-sm font-semibold text-ink">Project health</h2>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        {isPending && (
          <>
            <div className="h-12 animate-pulse rounded-lg bg-paper-dim" />
            <div className="h-12 animate-pulse rounded-lg bg-paper-dim" />
          </>
        )}
        {health?.length === 0 && !isPending && (
          <p className="text-xs text-muted">No projects to show health for yet.</p>
        )}
        {health?.map((p) => (
          <Link
            key={p.id}
            href={`/dashboard/${slug}/projects/${p.id}`}
            className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-xs transition hover:bg-paper-dim ${
              p.isAtRisk
                ? "border border-gold/30 bg-gold/[0.06]"
                : "bg-paper-dim/60"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink">{p.name}</span>
              <span className="text-muted">{p.client.name}</span>
              {p.isAtRisk && (
                <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                  At risk
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {p.overdueTaskCount > 0 && (
                <span className="flex items-center gap-1 font-semibold text-gold">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  {p.overdueTaskCount} overdue
                </span>
              )}
              <span className="flex items-center gap-1 text-muted">
                <Clock className="h-3.5 w-3.5" />
                {timeAgo(p.lastActivityAt)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
