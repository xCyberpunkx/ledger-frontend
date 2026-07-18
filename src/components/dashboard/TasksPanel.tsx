"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch, ApiError } from "@/lib/api";
import { ListTodo, Plus, Pencil, Trash2, Check } from "lucide-react";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

type Task = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assigneeId?: string | null;
  milestoneId?: string | null;
  assignee?: { id: string; user: { id: string; name: string } } | null;
};

type Milestone = { id: string; title: string };

type AssignableMember = {
  id: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  user: { id: string; name: string };
};

const STATUSES: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];
const PRIORITIES: TaskPriority[] = ["LOW", "MEDIUM", "HIGH", "URGENT"];

const STATUS_LABEL: Record<TaskStatus, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  DONE: "Done",
};

const PRIORITY_TONE: Record<TaskPriority, string> = {
  LOW: "text-muted",
  MEDIUM: "text-ink",
  HIGH: "text-gold",
  URGENT: "text-gold font-semibold",
};

export function TasksPanel({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();
  const base = `/organizations/${organizationId}/projects/${projectId}/tasks`;

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [milestoneId, setMilestoneId] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState<TaskPriority>("MEDIUM");
  const [editDueDate, setEditDueDate] = useState("");
  const [editAssigneeId, setEditAssigneeId] = useState("");
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState<TaskStatus | "">("");
  const [filterPriority, setFilterPriority] = useState<TaskPriority | "">("");
  const [filterAssigneeId, setFilterAssigneeId] = useState("");

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });

  const { data: milestones } = useQuery({
    queryKey: ["milestones", projectId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Milestone[]>(
        `/organizations/${organizationId}/projects/${projectId}/milestones`,
        token,
      );
    },
  });

  const { data: members } = useQuery({
    queryKey: ["assignable-members", projectId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<AssignableMember[]>(
        `/organizations/${organizationId}/projects/${projectId}/assignable-members`,
        token,
      );
    },
  });

  const { data: tasks, isPending } = useQuery({
    queryKey: ["tasks", projectId, filterStatus, filterPriority, filterAssigneeId],
    queryFn: async () => {
      const token = await getToken();
      const params = new URLSearchParams();
      if (filterStatus) params.set("status", filterStatus);
      if (filterPriority) params.set("priority", filterPriority);
      if (filterAssigneeId) params.set("assigneeId", filterAssigneeId);
      const qs = params.toString();
      return apiFetch<Task[]>(`${base}${qs ? `?${qs}` : ""}`, token);
    },
  });

  const createTask = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      return apiFetch<Task>(base, token, {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          priority,
          dueDate: dueDate || undefined,
          assigneeId: assigneeId || undefined,
          milestoneId: milestoneId || undefined,
        }),
      });
    },
    onSuccess: () => {
      invalidate();
      setTitle("");
      setPriority("MEDIUM");
      setDueDate("");
      setAssigneeId("");
      setMilestoneId("");
      setCreating(false);
      setErrorMsg(null);
    },
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't create that task.");
    },
  });

  const updateTask = useMutation({
    mutationFn: async (vars: { taskId: string; body: Record<string, unknown> }) => {
      const token = await getToken();
      return apiFetch<Task>(`${base}/${vars.taskId}`, token, {
        method: "PATCH",
        body: JSON.stringify(vars.body),
      });
    },
    onSuccess: () => invalidate(),
    onError: (err) => {
      setErrorMsg(err instanceof ApiError ? err.message : "Couldn't update that task.");
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      const token = await getToken();
      return apiFetch(`${base}/${taskId}`, token, { method: "DELETE" });
    },
    onSuccess: () => {
      invalidate();
      setConfirmingDeleteId(null);
    },
  });

  function startEdit(t: Task) {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditPriority(t.priority);
    setEditDueDate(t.dueDate ? t.dueDate.slice(0, 10) : "");
    setEditAssigneeId(t.assigneeId ?? "");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim().length < 1) return;
    createTask.mutate();
  }

  function handleEditSubmit(e: React.FormEvent, taskId: string) {
    e.preventDefault();
    if (editTitle.trim().length < 1) return;
    updateTask.mutate(
      {
        taskId,
        body: {
          title: editTitle.trim(),
          priority: editPriority,
          dueDate: editDueDate || undefined,
          assigneeId: editAssigneeId || undefined,
        },
      },
      { onSuccess: () => setEditingId(null) },
    );
  }

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="h-4 w-4 text-moss" />
          <h2 className="text-sm font-semibold text-ink">Tasks</h2>
        </div>
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-moss-dark"
          >
            <Plus className="h-3.5 w-3.5" /> New task
          </button>
        )}
      </div>

      {/* TASK-03 filters */}
      <div className="mt-4 flex flex-wrap gap-2">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TaskStatus | "")}
          className="rounded-lg border border-border bg-white px-2 py-1 text-xs text-ink outline-none focus:border-moss"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as TaskPriority | "")}
          className="rounded-lg border border-border bg-white px-2 py-1 text-xs text-ink outline-none focus:border-moss"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <select
          value={filterAssigneeId}
          onChange={(e) => setFilterAssigneeId(e.target.value)}
          className="rounded-lg border border-border bg-white px-2 py-1 text-xs text-ink outline-none focus:border-moss"
        >
          <option value="">Everyone</option>
          {members?.map((m) => (
            <option key={m.id} value={m.id}>
              {m.user.name}
            </option>
          ))}
        </select>
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
            placeholder="Task title"
            className="rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
          />
          <div className="flex gap-2">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 rounded-lg border border-border px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            >
              <option value="">Unassigned</option>
              {members?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.user.name}
                </option>
              ))}
            </select>
            <select
              value={milestoneId}
              onChange={(e) => setMilestoneId(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-white px-3 py-2 text-sm text-ink outline-none focus:border-moss"
            >
              <option value="">No milestone</option>
              {milestones?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title}
                </option>
              ))}
            </select>
          </div>
          {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createTask.isPending}
              className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper transition hover:bg-moss-dark disabled:opacity-60"
            >
              {createTask.isPending ? "Creating…" : "Create"}
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
        {tasks?.length === 0 && !isPending && (
          <p className="text-xs text-muted">No tasks match these filters.</p>
        )}
        {tasks?.map((t) => {
          if (editingId === t.id) {
            return (
              <form
                key={t.id}
                onSubmit={(e) => handleEditSubmit(e, t.id)}
                className="flex flex-col gap-2 rounded-lg border border-moss/30 bg-moss/[0.04] p-3"
              >
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="rounded-lg border border-border px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
                />
                <div className="flex gap-2">
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TaskPriority)}
                    className="flex-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="flex-1 rounded-lg border border-border px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
                  />
                </div>
                <select
                  value={editAssigneeId}
                  onChange={(e) => setEditAssigneeId(e.target.value)}
                  className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs text-ink outline-none focus:border-moss"
                >
                  <option value="">Unassigned</option>
                  {members?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.user.name}
                    </option>
                  ))}
                </select>
                {errorMsg && <p className="text-xs text-gold">{errorMsg}</p>}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updateTask.isPending}
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

          if (confirmingDeleteId === t.id) {
            return (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-gold/30 bg-gold/[0.06] px-3 py-2 text-xs"
              >
                <span className="text-ink">Delete {t.title}?</span>
                <div className="flex gap-3">
                  <button
                    onClick={() => deleteTask.mutate(t.id)}
                    disabled={deleteTask.isPending}
                    className="font-semibold text-gold hover:underline"
                  >
                    {deleteTask.isPending ? "Deleting…" : "Yes, delete"}
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
            <div
              key={t.id}
              className="group flex items-center justify-between rounded-lg bg-paper-dim/60 px-3 py-2.5 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium text-ink">{t.title}</span>
                <span className={PRIORITY_TONE[t.priority]}>{t.priority}</span>
                {t.assignee && (
                  <span className="text-muted">{t.assignee.user.name}</span>
                )}
                {t.dueDate && (
                  <span className="text-muted">
                    {new Date(t.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Same PATCH endpoint a kanban drag-drop will call next
                    pass — this dropdown is the list-view equivalent of
                    dragging a card to a new column. */}
                <select
                  value={t.status}
                  onChange={(e) =>
                    updateTask.mutate({
                      taskId: t.id,
                      body: { status: e.target.value as TaskStatus },
                    })
                  }
                  className="rounded-full border border-border bg-white px-2 py-1 text-[11px] text-ink outline-none focus:border-moss"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => startEdit(t)}
                    aria-label="Edit task"
                    className="text-muted hover:text-ink"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(t.id)}
                    aria-label="Delete task"
                    className="text-muted hover:text-gold"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
