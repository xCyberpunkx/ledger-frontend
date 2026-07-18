'use client';

import { useAuth } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getPortalProjects } from '@/lib/portal-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// This is the client's org switcher equivalent — flat list across
// however many agencies have invited them, per PortalService's own
// comment on why getAccessibleProjects aggregates across Client rows.
// No org grouping in v1 of this page; add it if a real client ever
// has more than a couple of agencies, which is unlikely early on.
export default function PortalHomePage() {
  const { getToken } = useAuth();

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['portal', 'projects'],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');
      return getPortalProjects(token);
    },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Your projects</h1>

      {isLoading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">
          Couldn&apos;t load your projects. Try refreshing.
        </p>
      )}

      {!isLoading && !error && projects?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          You don&apos;t have access to any projects yet.
        </p>
      )}

      <div className="space-y-3">
        {projects?.map((project) => (
          <Link key={project.id} href={`/portal/projects/${project.id}`}>
            <Card className="transition hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">{project.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {project.organization.name}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
