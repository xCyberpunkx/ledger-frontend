"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { Mail, Send, Clock } from "lucide-react";

type Invite = {
  id: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  status: "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
  createdAt: string;
};

export function InvitePanel({ organizationId }: { organizationId: string }) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: invites } = useQuery({
    queryKey: ["invites", organizationId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Invite[]>(`/organizations/${organizationId}/invites`, token);
    },
  });

  const inviteMutation = useMutation({
    mutationFn: async (inviteEmail: string) => {
      const token = await getToken();
      return apiFetch<Invite>(`/organizations/${organizationId}/invites`, token, {
        method: "POST",
        body: JSON.stringify({ email: inviteEmail }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invites", organizationId] });
      setEmail("");
      setErrorMsg(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't send that invite.");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    inviteMutation.mutate(email.trim());
  }

  const pending = invites?.filter((i) => i.status === "PENDING") ?? [];

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <Mail className="h-4 w-4 text-moss" />
        <h2 className="text-sm font-semibold text-ink">Invite a teammate</h2>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="teammate@studio.com"
          className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
        />
        <button
          type="submit"
          disabled={inviteMutation.isPending}
          className="flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
        >
          <Send className="h-3.5 w-3.5" /> Invite
        </button>
      </form>
      {errorMsg && <p className="mt-2 text-xs text-gold">{errorMsg}</p>}

      {pending.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted">Pending</p>
          {pending.map((invite) => (
            <div
              key={invite.id}
              className="flex items-center justify-between rounded-lg bg-paper-dim/60 px-3 py-2 text-xs"
            >
              <span className="text-ink">{invite.email}</span>
              <span className="flex items-center gap-1 text-muted">
                <Clock className="h-3 w-3" /> Pending
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
