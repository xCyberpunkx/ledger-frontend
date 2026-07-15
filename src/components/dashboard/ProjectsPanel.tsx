"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { FolderKanban, Plus, Users, X, Pencil, Trash2, Check } from "lucide-react";
import type { Client } from "./ClientsPanel";

type Project = {
  id: string;
  name: string;
  description?: string | null;
  client: { id: string; name: string };
  createdAt: string;
};

type OrgMember = {
  id: string; // membership id
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: { id: string; name: string; email: string };
};

type Assignment = {
  id: string;
  membershipId: string;
};

export function ProjectsPanel({
  organizationId,
  isAdmin,
}: {
  organizationId: string;
  isAdmin: boolean;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [managingProjectId, setManagingProjectId] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["projects", organizationId] });

  const { data: projects, isPending } = useQuery({
    queryKey: ["projects", organizationId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Project[]>(`/organizations/${organizationId}/projects`, token);
    },
  });

  // Only OWNER/ADMIN can hit /clients at all — enabled: isAdmin keeps
  // the request from firing rather than firing it and discarding a 403.
  const { data: clients } = useQuery({
    queryKey: ["clients", organizationId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Client[]>(`/organizations/${organizationId}/clients`, token);
    },
    enabled: isAdmin,
  });

  const createProject = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiFetch<Project>(`/organizations/${organizationId}/projects`, token, {
        method: "POST",
        body: JSON.stringify({
          clientId,
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });
    },
    onSuccess: () => {
      invalidate();
      setName("");
      setDescription("");
      setClientId("");
      setCreating(false);
      setErrorMsg(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't create that project.");
    },
  });

  const updateProject = useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken();
      return apiFetch<Project>(`/organizations/${organizationId}/projects/${projectId}`, token, {
        method: "PATCH",
        body: JSON.stringify({
          name: editName.trim(),
          description: editDescription.trim() || undefined,
        }),
      });
    },
    onSuccess: () => {
      invalidate();
      setEditingId(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't update that project.");
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (projectId: string) => {
      const token = await getToken();
      return apiFetch(`/organizations/${organizationId}/projects/${projectId}`, token, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      invalidate();
      setConfirmingDeleteId(null);
    },
  });

  function startEdit(p: Project) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditDescription(p.description ?? "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 1 || !clientId) return;
    createProject.mutate();
  }

  function handleEditSubmit(e: React.FormEvent, projectId: string) {
    e.preventDefault();
    if (editName.trim().length < 1) return;
    updateProject.mutate(projectId);
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="h-4 w-4 text-moss" />
          <h2 className="text-sm font-semibold text-ink">Projects</h2>
        </div>
        {isAdmin && !creating && (
          <button
            onClick={() => setCreating(true)}
            disabled={!clients || clients.length === 0}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> New project
          </button>
        )}
      </div>

      {isAdmin && clients?.length === 0 && (
        <p className="mt-3 text-xs text-muted">Add a client above before creating a project.</p>
      )}

      {creating && (
        <form
          onSubmit={handleSubmit}
          className="mt-4 flex flex-col gap-2 rounded-xl border border-border bg-paper-dim/50 p-4"
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Project name"
            className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          <select
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          >
            <option value="">Select a client…</option>
            {clients?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="resize-none rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createProject.isPending}
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
            >
              {createProject.isPending ? "Creating…" : "Create"}
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
            <div className="h-12 animate-pulse rounded-lg bg-paper-dim" />
            <div className="h-12 animate-pulse rounded-lg bg-paper-dim" />
          </>
        )}
        {projects?.length === 0 && !isPending && (
          <p className="text-xs text-muted">
            {isAdmin ? "No projects yet." : "You're not assigned to any projects yet."}
          </p>
        )}
        {projects?.map((p) => {
          if (editingId === p.id) {
            return (
              <form
                key={p.id}
                onSubmit={(e) => handleEditSubmit(e, p.id)}
                className="flex flex-col gap-2 rounded-lg border border-moss/30 bg-moss/[0.04] p-3"
              >
                <input
                  autoFocus
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  rows={2}
                  className="resize-none rounded-lg border border-border px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
                />
                {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateProject.isPending}
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
            );
          }

          if (confirmingDeleteId === p.id) {
            return (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-lg border border-gold/30 bg-gold/[0.06] px-3 py-2 text-xs"
              >
                <span className="text-ink">Delete {p.name}?</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteProject.mutate(p.id)}
                    disabled={deleteProject.isPending}
                    className="font-semibold text-gold hover:underline"
                  >
                    {deleteProject.isPending ? "Deleting…" : "Yes, delete"}
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(null)}
                    className="text-muted hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div key={p.id} className="group rounded-lg bg-paper-dim/60 px-3 py-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-ink">{p.name}</span>
                  <span className="ml-2 text-muted">{p.client.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <button
                      onClick={() =>
                        setManagingProjectId(managingProjectId === p.id ? null : p.id)
                      }
                      className="flex items-center gap-1 text-muted hover:text-ink"
                    >
                      <Users className="h-3.5 w-3.5" /> Team
                    </button>
                  )}
                  {isAdmin && (
                    <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                      <button
                        onClick={() => startEdit(p)}
                        aria-label="Edit project"
                        className="text-muted hover:text-ink"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setConfirmingDeleteId(p.id)}
                        aria-label="Delete project"
                        className="text-muted hover:text-gold"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {p.description && <p className="mt-1 text-muted">{p.description}</p>}
              {isAdmin && managingProjectId === p.id && (
                <ProjectTeamManager organizationId={organizationId} projectId={p.id} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProjectTeamManager({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["org-members", organizationId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<OrgMember[]>(`/organizations/${organizationId}/members`, token);
    },
  });

  const { data: assignments } = useQuery({
    queryKey: ["assignments", projectId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Assignment[]>(
        `/organizations/${organizationId}/projects/${projectId}/assignments`,
        token,
      );
    },
  });

  const assignMutation = useMutation({
    mutationFn: async (membershipId: string) => {
      const token = await getToken();
      return apiFetch(
        `/organizations/${organizationId}/projects/${projectId}/assignments`,
        token,
        { method: "POST", body: JSON.stringify({ membershipId }) },
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments", projectId] }),
  });

  const unassignMutation = useMutation({
    mutationFn: async (assignmentId: string) => {
      const token = await getToken();
      return apiFetch(
        `/organizations/${organizationId}/projects/${projectId}/assignments/${assignmentId}`,
        token,
        { method: "DELETE" },
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["assignments", projectId] }),
  });

  return (
    <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
      {members?.map((m) => {
        const assignment = assignments?.find((a) => a.membershipId === m.id);
        return (
          <div key={m.id} className="flex items-center justify-between">
            <span className="text-ink">
              {m.user.name} <span className="text-muted">({m.role})</span>
            </span>
            {assignment ? (
              <button
                onClick={() => unassignMutation.mutate(assignment.id)}
                className="flex items-center gap-1 text-gold hover:underline"
              >
                <X className="h-3 w-3" /> Remove
              </button>
            ) : (
              <button
                onClick={() => assignMutation.mutate(m.id)}
                className="text-moss hover:underline"
              >
                Assign
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
