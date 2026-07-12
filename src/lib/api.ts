const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// A single fetch wrapper so every call gets the same base URL, auth
// header, and error shape — call sites just await and catch ApiError,
// they never touch fetch() directly. token comes from Clerk's
// useAuth().getToken() at the call site; this module stays framework-agnostic.
export async function apiFetch<T>(
  path: string,
  token: string | null,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(body?.message ?? res.statusText, res.status);
  }

  // 204 No Content has no body to parse
  if (res.status === 204) return undefined as T;
  return res.json();
}
