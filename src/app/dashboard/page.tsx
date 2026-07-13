"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { Plus, Building2, ArrowRight } from "lucide-react";

type Organization = {
  id: string;
  name: string;
  slug: string;
  memberships: { role: "OWNER" | "ADMIN" | "MEMBER" }[];
};

// A skeleton that mirrors the actual org-row layout below, not a generic
// gray bar — the shape shouldn't shift when real data arrives.
function OrgRowSkeleton() {
  return (
    <div className="flex animate-pulse items-center justify-between rounded-2xl border border-border bg-paper-dim p-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-border" />
        <div className="space-y-2">
          <div className="h-3.5 w-32 rounded bg-border" />
          <div className="h-2.5 w-20 rounded bg-border/70" />
        </div>
      </div>
      <div className="h-5 w-14 rounded-full bg-border" />
    </div>
  );
}

export default function DashboardPage() {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [creating, setCreating] = useState(searchParams.get("create") === "1");
  const [name, setName] = useState("");

  const {
    data: orgs,
    isPending,
    error,
  } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Organization[]>("/organizations", token);
    },
  });

  const createOrg = useMutation({
    mutationFn: async (orgName: string) => {
      const token = await getToken();
      return apiFetch<Organization>("/organizations", token, {
        method: "POST",
        body: JSON.stringify({ name: orgName }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      setName("");
      setCreating(false);
    },
  });

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    createOrg.mutate(name.trim());
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-moss">Dashboard</p>
          <h1 className="mt-1 font-display text-display-sm text-ink">Your organizations</h1>
        </div>
        {orgs && orgs.length > 0 && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-moss-dark"
          >
            <Plus className="h-4 w-4" /> New organization
          </button>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-2xl border border-gold/30 bg-gold/[0.06] p-4 text-sm text-ink">
          <p className="font-medium">Couldn&apos;t load your organizations.</p>
          <p className="mt-1 text-muted">{error instanceof Error ? error.message : "Try refreshing the page."}</p>
        </div>
      )}

      {isPending && !error && (
        <div className="mt-6 flex flex-col gap-3">
          <OrgRowSkeleton />
          <OrgRowSkeleton />
        </div>
      )}

      {orgs && orgs.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {orgs.map((org) => (
            <a
              key={org.id}
              href={`/dashboard/${org.slug}`}
              className="group flex items-center justify-between rounded-2xl border border-border bg-paper-dim p-4 shadow-soft transition hover:shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss/10">
                  <Building2 className="h-5 w-5 text-moss" />
                </div>
                <div>
                  <p className="font-semibold text-ink">{org.name}</p>
                  <p className="font-mono text-xs text-muted">{org.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-moss">
                  {org.memberships[0]?.role}
                </span>
                <ArrowRight className="h-4 w-4 text-muted transition group-hover:translate-x-0.5 group-hover:text-ink" />
              </div>
            </a>
          ))}
        </div>
      )}

      {orgs && orgs.length === 0 && !creating && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-moss/10">
            <Building2 className="h-6 w-6 text-moss" />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            You don&apos;t belong to an organization yet. In Ledger, everything —
            clients, projects, teammates — lives under one.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="mt-5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper transition hover:bg-moss-dark"
          >
            Create your organization
          </button>
        </div>
      )}

      {creating && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-soft"
        >
          <label className="font-mono text-xs uppercase tracking-widest text-muted">
            Organization name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Studio"
            className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          {createOrg.isError && (
            <p className="mt-2 text-xs text-gold">
              {createOrg.error instanceof Error ? createOrg.error.message : "Couldn't create the organization."}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={createOrg.isPending || name.trim().length < 2}
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-50"
            >
              {createOrg.isPending ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-full px-5 py-2 text-sm font-semibold text-muted transition hover:bg-paper-dim"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
