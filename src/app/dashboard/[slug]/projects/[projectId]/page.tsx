"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { ArrowLeft } from "lucide-react";
import { MilestonesPanel } from "@/components/dashboard/MilestonesPanel";
import { TasksPanel } from "@/components/dashboard/TasksPanel";
import { FilesPanel } from "@/components/dashboard/FilesPanel";
import { CommentsPanel } from "@/components/dashboard/CommentsPanel";

type Organization = {
  id: string;
  name: string;
  slug: string;
  memberships: { role: "OWNER" | "ADMIN" | "MEMBER" }[];
};

type Project = {
  id: string;
  name: string;
  description?: string | null;
  client: { id: string; name: string };
  createdAt: string;
};

export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string; projectId: string };
}) {
  const { getToken } = useAuth();

  // Same pattern as the org page: resolve the org from the already-cached
  // organizations list rather than a second endpoint for "org by slug."
  const { data: orgs } = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Organization[]>("/organizations", token);
    },
  });

  const org = orgs?.find((o) => o.slug === params.slug);
  const role = org?.memberships[0]?.role;
  const isAdmin = role === "OWNER" || role === "ADMIN";

  // Fetching the project directly (not just reading it out of the
  // already-cached project list) because this page can be reached by a
  // direct URL, not only by clicking through the org page — the org's
  // project-list cache might not exist yet.
  const {
    data: project,
    isPending,
    error,
  } = useQuery({
    queryKey: ["project", org?.id, params.projectId],
    queryFn: async () => {
      const token = await getToken();
      return apiFetch<Project>(
        `/organizations/${org!.id}/projects/${params.projectId}`,
        token,
      );
    },
    enabled: !!org,
  });

  if (!orgs || (org && isPending)) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="h-8 w-56 animate-pulse rounded bg-border" />
        <div className="mt-3 h-4 w-32 animate-pulse rounded bg-border/70" />
      </div>
    );
  }

  // Same deliberate non-disclosure as the org page and every backend
  // guard this session: "not found" covers both "doesn't exist" and
  // "you can't see it," and never says which.
  if (!org || error || !project) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <p className="font-display text-2xl italic text-ink">Not found</p>
        <p className="mt-2 text-sm text-muted">
          Either this project doesn&apos;t exist, or you don&apos;t have access to it.
        </p>
        <Link
          href={`/dashboard/${params.slug}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm text-moss hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to organization
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <Link
        href={`/dashboard/${params.slug}`}
        className="flex items-center gap-1.5 text-xs text-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> {org.name}
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <h1 className="font-display text-display-sm text-ink">{project.name}</h1>
        <span className="rounded-full bg-moss/10 px-3 py-1 text-xs font-semibold text-moss">
          {project.client.name}
        </span>
      </div>
      {project.description && (
        <p className="mt-2 max-w-xl text-sm text-muted">{project.description}</p>
      )}

      <MilestonesPanel
        organizationId={org.id}
        projectId={project.id}
        isAdmin={isAdmin}
      />
      <TasksPanel organizationId={org.id} projectId={project.id} />
      <FilesPanel organizationId={org.id} projectId={project.id} />
      {/* Project-level thread for now — the same component drops onto
          a Task or FileAsset later just by passing taskId/fileAssetId
          instead, no changes needed to CommentsPanel itself. */}
      <CommentsPanel organizationId={org.id} projectId={project.id} />
    </div>
  );
}
