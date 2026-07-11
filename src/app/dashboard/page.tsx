"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { apiFetch } from "@/lib/api";
import { Plus, Building2 } from "lucide-react";

type Organization = {
  id: string;
  name: string;
  slug: string;
  memberships: { role: "OWNER" | "ADMIN" | "MEMBER" }[];
};

export default function DashboardPage() {
  const { getToken } = useAuth();
  const [orgs, setOrgs] = useState<Organization[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadOrgs = useCallback(async () => {
    try {
      const token = await getToken();
      const data = await apiFetch<Organization[]>("/organizations", token);
      setOrgs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load organizations");
    }
  }, [getToken]);

  useEffect(() => {
    loadOrgs();
  }, [loadOrgs]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const token = await getToken();
      await apiFetch("/organizations", token, {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setName("");
      setCreating(false);
      await loadOrgs();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create organization");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Your organizations</h1>
        {orgs && orgs.length > 0 && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white hover:bg-ink-dark"
          >
            <Plus className="h-4 w-4" /> New organization
          </button>
        )}
      </div>

      {error && (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {orgs === null && !error && (
        <p className="mt-6 text-sm text-muted">Loading…</p>
      )}

      {orgs && orgs.length > 0 && (
        <div className="mt-6 flex flex-col gap-3">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="flex items-center justify-between rounded-2xl border border-border bg-paper-dim p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-moss/10">
                  <Building2 className="h-5 w-5 text-moss" />
                </div>
                <div>
                  <p className="font-semibold">{org.name}</p>
                  <p className="text-xs text-muted">{org.slug}</p>
                </div>
              </div>
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-moss">
                {org.memberships[0]?.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {orgs && orgs.length === 0 && !creating && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted">
            You don&apos;t belong to an organization yet. In Ledger, everything &mdash;
            clients, projects, teammates &mdash; lives under one.
          </p>
          <button
            onClick={() => setCreating(true)}
            className="mt-4 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white hover:bg-ink-dark"
          >
            Create your organization
          </button>
        </div>
      )}

      {creating && (
        <form
          onSubmit={handleCreate}
          className="mt-6 rounded-2xl border border-border bg-white p-5"
        >
          <label className="text-xs font-semibold uppercase tracking-widest text-muted">
            Organization name
          </label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Studio"
            className="mt-2 w-full rounded-xl border border-border px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={submitting || name.trim().length < 2}
              className="rounded-full bg-ink px-5 py-2 text-sm font-semibold text-white hover:bg-ink-dark disabled:opacity-50"
            >
              {submitting ? "Creating…" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-full px-5 py-2 text-sm font-semibold text-muted hover:bg-paper-dim"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </main>
  );
}
