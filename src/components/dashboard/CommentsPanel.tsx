"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { MessageSquare, Send, Trash2 } from "lucide-react";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  authorMembershipId?: string | null;
  authorMembership?: { id: string; user: { id: string; name: string } } | null;
};

// Reusable across all three comment targets the schema supports — pass
// taskId to thread on a task, fileAssetId to thread on a file, or
// neither for the project's own direct thread. Same component either
// way; only the query params and the POST body's target field change.
export function CommentsPanel({
  organizationId,
  projectId,
  taskId,
  fileAssetId,
}: {
  organizationId: string;
  projectId: string;
  taskId?: string;
  fileAssetId?: string;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const base = `/organizations/${organizationId}/projects/${projectId}/comments`;

  const [body, setBody] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  // The query key has to encode which thread this is — a task's
  // comments, a file's comments, or the project's direct thread are
  // three different lists and must not collide in the cache.
  const target = taskId ?? fileAssetId ?? "project";
  const queryKey = ["comments", projectId, target];

  const invalidate = () => queryClient.invalidateQueries({ queryKey });

  const { data: comments, isPending } = useQuery({
    queryKey,
    queryFn: async () => {
      const token = await getToken();
      const params = new URLSearchParams();
      if (taskId) params.set("taskId", taskId);
      if (fileAssetId) params.set("fileAssetId", fileAssetId);
      const qs = params.toString();
      return apiFetch<Comment[]>(`${base}${qs ? `?${qs}` : ""}`, token);
    },
  });

  const createComment = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiFetch<Comment>(base, token, {
        method: "POST",
        body: JSON.stringify({ taskId, fileAssetId, body: body.trim() }),
      });
    },
    onSuccess: () => {
      invalidate();
      setBody("");
      setErrorMsg(null);
    },
    onError: (err) => {
      setErrorMsg(
        err instanceof ApiError ? err.message : "Couldn't post that comment.",
      );
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const token = await getToken();
      return apiFetch(`${base}/${commentId}`, token, { method: "DELETE" });
    },
    onSuccess: () => {
      invalidate();
      setConfirmingDeleteId(null);
    },
    onError: (err) => {
      // Most likely a 403 — the backend only lets the author or an
      // admin delete a comment. Surfaced rather than swallowed, since
      // the delete button itself doesn't know the viewer's role.
      setErrorMsg(
        err instanceof ApiError ? err.message : "Couldn't delete that comment.",
      );
      setConfirmingDeleteId(null);
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 1) return;
    createComment.mutate();
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-moss" />
        <h2 className="text-sm font-semibold text-ink">Comments</h2>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {isPending && <div className="h-10 animate-pulse rounded-lg bg-paper-dim" />}
        {comments?.length === 0 && !isPending && (
          <p className="text-xs text-muted">No comments yet.</p>
        )}
        {comments?.map((c) => (
          <div key={c.id} className="group rounded-lg bg-paper-dim/60 px-3 py-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink">
                {c.authorMembership?.user.name ?? "Unknown"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-muted">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
                {confirmingDeleteId === c.id ? (
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => deleteComment.mutate(c.id)}
                      disabled={deleteComment.isPending}
                      className="font-semibold text-gold hover:underline"
                    >
                      {deleteComment.isPending ? "Deleting…" : "Confirm"}
                    </button>
                    <button
                      onClick={() => setConfirmingDeleteId(null)}
                      className="text-muted hover:underline"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirmingDeleteId(c.id)}
                    aria-label="Delete comment"
                    className="text-muted opacity-0 transition hover:text-gold group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="mt-1 whitespace-pre-wrap text-ink">{c.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Add a comment…"
          className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
        />
        <button
          type="submit"
          disabled={createComment.isPending || body.trim().length < 1}
          className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
        >
          <Send className="h-3.5 w-3.5" /> Post
        </button>
      </form>
      {errorMsg && <p className="mt-2 text-xs text-gold">{errorMsg}</p>}
    </div>
  );
}
