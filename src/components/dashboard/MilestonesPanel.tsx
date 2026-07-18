"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { Flag, Plus, Pencil, Trash2, Check } from "lucide-react";

type Milestone = {
  id: string;
  title: string;
  dueDate?: string | null;
};

export function MilestonesPanel({
  organizationId,
  projectId,
  isAdmin,
}: {
  organizationId: string;
  projectId: string;
  isAdmin: boolean;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const base = `/organizations/${organizationId}/projects/${projectId}/milestones`;
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });

  const { data: milestones, isPending } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Milestone[]>(base, token);
    },
  });

  const createMilestone = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiFetch<Milestone>(base, token, {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), dueDate: dueDate || undefined }),
      });
    },
    onSuccess: () => {
      invalidate();
      setTitle("");
      setDueDate("");
      setCreating(false);
      setErrorMsg(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't create that milestone.");
    },
  });

  const updateMilestone = useMutation({
    mutationFn: async (milestoneId: string) => {
      const token = await getToken();
      return apiFetch<Milestone>(`${base}/${milestoneId}`, token, {
        method: "PATCH",
        body: JSON.stringify({ title: editTitle.trim(), dueDate: editDueDate || undefined }),
      });
    },
    onSuccess: () => {
      invalidate();
      setEditingId(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't update that milestone.");
    },
  });

  const deleteMilestone = useMutation({
    mutationFn: async (milestoneId: string) => {
      const token = await getToken();
      return apiFetch(`${base}/${milestoneId}`, token, { method: "DELETE" });
    },
    onSuccess: () => {
      invalidate();
      setConfirmingDeleteId(null);
    },
  });

  function startEdit(m: Milestone) {
    setEditingId(m.id);
    setEditTitle(m.title);
    setEditDueDate(m.dueDate ? m.dueDate.slice(0, 10) : "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 1) return;
    createMilestone.mutate();
  }

  function handleEditSubmit(e: React.FormEvent, milestoneId: string) {
    e.preventDefault();
    if (editTitle.trim().length < 1) return;
    updateMilestone.mutate(milestoneId);
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-moss" />
          <h2 className="text-sm font-semibold text-ink">Milestones</h2>
        </div>
        {isAdmin && !creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-moss-dark"
          >
            <Plus className="h-3.5 w-3.5" /> Add milestone
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
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Milestone title"
            className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createMilestone.isPending}
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
            >
              {createMilestone.isPending ? "Adding…" : "Add"}
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
        {isPending && <div className="h-10 animate-pulse rounded-lg bg-paper-dim" />}
        {milestones?.length === 0 && !isPending && (
          <p className="text-xs text-muted">No milestones yet.</p>
        )}
        {milestones?.map((m) =>
          editingId === m.id ? (
            <form
              key={m.id}
              onSubmit={(e) => handleEditSubmit(e, m.id)}
              className="flex flex-col gap-2 rounded-lg border border-moss/30 bg-moss/[0.04] p-3"
            >
              <input
                autoFocus
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
              />
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="rounded-lg border border-border px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
              />
              {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={updateMilestone.isPending}
                  className="flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-paper hover:bg-moss-dark"
                >
                  <Check className="h-3 w-3" /> Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-muted hover:bg-paper-dim"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : confirmingDeleteId === m.id ? (
            <div
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-gold/30 bg-gold/[0.06] px-3 py-2 text-xs"
            >
              <span className="text-ink">Delete {m.title}?</span>
              <div className="flex gap-3">
                <button
                  onClick={() => deleteMilestone.mutate(m.id)}
                  disabled={deleteMilestone.isPending}
                  className="font-semibold text-gold hover:underline"
                >
                  {deleteMilestone.isPending ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmingDeleteId(null)}
                  className="text-muted hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div
              key={m.id}
              className="group flex items-center justify-between rounded-lg bg-paper-dim/60 px-3 py-2 text-xs"
            >
              <span className="font-medium text-ink">{m.title}</span>
              <div className="flex items-center gap-3">
                {m.dueDate && (
                  <span className="text-muted">
                    {new Date(m.dueDate).toLocaleDateString()}
                  </span>
                )}
                {isAdmin && (
                  <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => startEdit(m)}
                      aria-label="Edit milestone"
                      className="text-muted hover:text-ink"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(m.id)}
                      aria-label="Delete milestone"
                      className="text-muted hover:text-gold"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  );
}
