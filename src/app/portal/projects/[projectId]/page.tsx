'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { getPortalProject, PortalApiError } from '@/lib/portal-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PortalProjectPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { getToken } = useAuth();

  const { data: project, isLoading, error } = useQuery({
    queryKey: ['portal', 'project', projectId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return getPortalProject(projectId, token);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Skeleton className="h-8 w-1/2" />
      </div>
    );
  }

  if (error) {
    const message =
      error instanceof PortalApiError && error.status === 404
        ? "This project doesn't exist or you don't have access to it."
        : 'Something went wrong loading this project.';
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <p className="text-sm text-destructive">{message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">{project?.name}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {project?.client.name}
      </p>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Progress</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Milestones, tasks, and files will show up here once that part of
          the portal is built.
        </CardContent>
      </Card>
    </div>
  );
}
