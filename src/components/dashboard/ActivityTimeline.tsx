"use client";

import { useAuth } from "@clerk/nextjs";
import { useInfiniteQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import {
  Activity,
  CheckCircle2,
  ArrowRightLeft,
  MessageSquare,
  FileText,
  type LucideIcon,
} from "lucide-react";

type ActivityEventDto = {
  id: string;
  type: string;
  actorType: "MEMBERSHIP" | "CLIENT" | "SYSTEM";
  actorId: string | null;
  actorName: string | null;
  metadata: Record<string, string | undefined> | null;
  createdAt: string;
};

type ActivityPage = {
  items: ActivityEventDto[];
  nextCursor: string | null;
};

const STATUS_LABEL: Record<string, string> = {
  TODO: "To do",
  IN_PROGRESS: "In progress",
  IN_REVIEW: "In review",
  DONE: "Done",
};

const EVENT_ICON: Record<string, LucideIcon> = {
  "task.completed": CheckCircle2,
  "task.status_changed": ArrowRightLeft,
  "comment.created": MessageSquare,
  "file.uploaded": FileText,
};

// Free-text `type` + `metadata` (schema is intentionally loose — see
// ActivityEvent's own comment) means the frontend, not the backend, is
// what turns each row into a sentence. Unknown types still render
// something reasonable rather than a blank line.
function describeEvent(e: ActivityEventDto): string {
  const who = e.actorName ?? "Someone";
  const m = e.metadata ?? {};
  switch (e.type) {
    case "task.completed":
      return `${who} marked "${m.taskTitle ?? "a task"}" done`;
    case "task.status_changed":
      return `${who} moved "${m.taskTitle ?? "a task"}" to ${
        STATUS_LABEL[m.toStatus ?? ""] ?? m.toStatus ?? "a new status"
      }`;
    case "comment.created":
      return `${who} commented on ${
        m.targetType === "task"
          ? "a task"
          : m.targetType === "file"
            ? "a file"
            : "the project"
      }`;
    case "file.uploaded":
      return `${who} uploaded "${m.originalName ?? "a file"}"`;
    default:
      return `${who} — ${e.type}`;
  }
}

export function ActivityTimeline({
  organizationId,
  projectId,
}: {
  organizationId: string;
  projectId: string;
}) {
  const { getToken } = useAuth();
  const base = `/organizations/${organizationId}/projects/${projectId}/activity`;

  const { data, isPending, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["activity", projectId],
      queryFn: async ({ pageParam }: { pageParam?: string }) => {
        const token = await getToken();
        const qs = pageParam ? `?cursor=${pageParam}` : "";
        return apiFetch<ActivityPage>(`${base}${qs}`, token);
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  const events = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="mt-10 rounded-2xl border border-border bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-moss" />
        <h2 className="text-sm font-semibold text-ink">Activity</h2>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {isPending && (
          <>
            <div className="h-8 animate-pulse rounded-lg bg-paper-dim" />
            <div className="h-8 animate-pulse rounded-lg bg-paper-dim" />
          </>
        )}
        {events.length === 0 && !isPending && (
          <p className="text-xs text-muted">No activity yet.</p>
        )}
        {events.map((e) => {
          const Icon = EVENT_ICON[e.type] ?? Activity;
          return (
            <div key={e.id} className="flex items-start gap-3 text-xs">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-moss/10">
                <Icon className="h-3 w-3 text-moss" />
              </div>
              <div>
                <p className="text-ink">{describeEvent(e)}</p>
                <p className="mt-0.5 text-muted">
                  {new Date(e.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="mt-4 rounded-full px-4 py-2 text-xs font-semibold text-moss transition hover:bg-paper-dim disabled:opacity-60"
        >
          {isFetchingNextPage ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
