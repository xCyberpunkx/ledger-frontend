"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { Building2, Plus } from "lucide-react";

export type Client = {
  id: string;
  name: string;
  company?: string | null;
  email?: string | null;
  createdAt: string;
};

export function ClientsPanel({ organizationId }: { organizationId: string }) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: clients, isPending } = useQuery({
    queryKey: ["clients", organizationId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Client[]>(`/organizations/${organizationId}/clients`, token);
    },
  });

  const createClient = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiFetch<Client>(`/organizations/${organizationId}/clients`, token, {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim() || undefined,
          email: email.trim() || undefined,
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", organizationId] });
      setName("");
      setCompany("");
      setEmail("");
      setCreating(false);
      setErrorMsg(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't create that client.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 1) return;
    createClient.mutate();
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-moss" />
          <h2 className="text-sm font-semibold text-ink">Clients</h2>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-moss-dark"
          >
            <Plus className="h-3.5 w-3.5" /> Add client
          </button>
        )}
      </div>

      {creating && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-2 rounded-xl border border-border bg-paper-dim/50 p-4"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Client name"
            className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          <div className="flex gap-2">
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company (optional)"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            />
          </div>
          {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createClient.isPending}
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
            >
              {createClient.isPending ? "Adding…" : "Add"}
            </button>
            <button
              type="button"
              onClick={() => setCreating(false)}
              className="rounded-full px-4 py-2 text-xs font-semibold text-muted hover:bg-paper-dim"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-4 flex flex-col gap-2">
        {isPending && (
          <>
            <div className="h-10 animate-pulse rounded-lg bg-paper-dim" />
            <div className="h-10 animate-pulse rounded-lg bg-paper-dim" />
          </>
        )}
        {clients?.length === 0 && !isPending && (
          <p className="text-xs text-muted">No clients yet — add one to start a project.</p>
        )}
        {clients?.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-lg bg-paper-dim/60 px-3 py-2 text-xs"
          >
            <div>
              <span className="font-medium text-ink">{c.name}</span>
              {c.company && <span className="ml-2 text-muted">{c.company}</span>}
            </div>
            {c.email && <span className="text-muted">{c.email}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
