// Shared fetch helper for portal endpoints. Every call attaches the
// Clerk session token fresh (per your gotcha #3 — tokens expire in
// ~60s, never cache one) and throws on non-2xx so TanStack Query's
// error state does the right thing without each call re-checking.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

export class PortalApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function portalFetch(
  path: string,
  token: string,
  init?: RequestInit,
) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    // 404 here is doing real work per PortalService's non-disclosure
    // principle — "not found" covers both "doesn't exist" and "not
    // yours," deliberately. Surface the server's message as-is rather
    // than inventing a friendlier one that might contradict it.
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new PortalApiError(res.status, body.message ?? 'Request failed');
  }

  return res.json();
}

export function acceptPortalInvite(token: string, authToken: string) {
  return portalFetch(`/portal/invites/${token}/accept`, authToken, {
    method: 'POST',
  }) as Promise<{ projectId: string }>;
}

export function getPortalProjects(authToken: string) {
  return portalFetch('/portal/projects', authToken) as Promise<
    Array<{
      id: string;
      name: string;
      client: { id: string; name: string };
      organization: { id: string; name: string; slug: string };
    }>
  >;
}

export function getPortalProject(projectId: string, authToken: string) {
  return portalFetch(`/portal/projects/${projectId}`, authToken) as Promise<{
    id: string;
    name: string;
    client: { id: string; name: string };
  }>;
}
