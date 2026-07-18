'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth, SignIn, useUser } from '@clerk/nextjs';
import { useMutation } from '@tanstack/react-query';
import { acceptPortalInvite, PortalApiError } from '@/lib/portal-api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// The real state machine here isn't just loading/error/success — a
// client clicking this link is almost certainly NOT signed in yet
// (they're an external person, not someone who already has a Clerk
// session with this app). So the page has to hold the token, show
// Clerk's own sign-in/sign-up UI first, and only fire the accept call
// once useUser() confirms a session exists. Clerk's afterSignInUrl
// looping back to this exact URL (with the token still in the query
// string) is what makes that handoff work without a second page.
export default function AcceptPortalInvitePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const token = searchParams.get('token');
  const [hasAttempted, setHasAttempted] = useState(false);

  const acceptMutation = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error('Missing invite token');
      const authToken = await getToken();
      if (!authToken) throw new Error('Not authenticated');
      return acceptPortalInvite(token, authToken);
    },
    onSuccess: (data) => {
      router.push(`/portal/projects/${data.projectId}`);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && token && !hasAttempted) {
      setHasAttempted(true);
      acceptMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, token, hasAttempted]);

  if (!token) {
    return (
      <PortalMessage title="Invalid invite link" message="This invite link is missing its token. Ask for a new one." />
    );
  }

  if (!isLoaded) {
    return <PortalMessage title="Loading..." message="" icon="spinner" />;
  }

  if (!isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
        <div className="w-full max-w-md space-y-4">
          <p className="text-center text-sm text-muted-foreground">
            Sign in with the email your invite was sent to, to view your project.
          </p>
          <SignIn
            routing="hash"
            afterSignInUrl={`/portal/accept?token=${token}`}
            afterSignUpUrl={`/portal/accept?token=${token}`}
          />
        </div>
      </div>
    );
  }

  if (acceptMutation.isError) {
    const err = acceptMutation.error;
    const message =
      err instanceof PortalApiError
        ? err.message
        : 'Something went wrong accepting this invite.';
    return (
      <PortalMessage
        title="Couldn't accept invite"
        message={
          err instanceof PortalApiError && err.status === 403
            ? `${message} You're signed in as ${user?.primaryEmailAddress?.emailAddress}.`
            : message
        }
      />
    );
  }

  return <PortalMessage title="Setting up your access..." message="" icon="spinner" />;
}

function PortalMessage({
  title,
  message,
  icon,
}: {
  title: string;
  message: string;
  icon?: 'spinner';
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon === 'spinner' && <Loader2 className="h-4 w-4 animate-spin" />}
            {title}
          </CardTitle>
        </CardHeader>
        {message && <CardContent className="text-sm text-muted-foreground">{message}</CardContent>}
      </Card>
    </div>
  );
}
