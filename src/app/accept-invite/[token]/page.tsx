"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { apiFetch, ApiError } from "@/lib/api";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

type Organization = { id: string; name: string; slug: string };

export default function AcceptInvitePage({ params }: { params: { token: string } }) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function accept() {
      try {
        const token = await getToken();
        const org = await apiFetch<Organization>(`/invites/${params.token}/accept`, token, {
          method: "POST",
        });
        if (cancelled) return;
        setStatus("success");
        // Short pause so "You're in" is actually readable, not a flash
        // before the redirect fires.
        setTimeout(() => router.push(`/dashboard/${org.slug}`), 1600);
      } catch (err) {
        if (cancelled) return;
        setMessage(
          err instanceof ApiError ? err.message : "Something went wrong accepting this invite.",
        );
        setStatus("error");
      }
    }

    accept();
    return () => {
      cancelled = true;
    };
  }, [params.token, getToken, router]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
      {status === "pending" && (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-moss" />
          <p className="mt-4 text-sm text-muted">Accepting your invite…</p>
        </>
      )}
      {status === "success" && (
        <>
          <CheckCircle2 className="h-8 w-8 text-moss" />
          <p className="mt-4 font-display text-xl italic text-ink">You&apos;re in.</p>
          <p className="mt-1 text-sm text-muted">Taking you to the dashboard…</p>
        </>
      )}
      {status === "error" && (
        <>
          <XCircle className="h-8 w-8 text-gold" />
          <p className="mt-4 font-display text-xl italic text-ink">Couldn&apos;t accept this invite</p>
          <p className="mt-2 text-sm text-muted">{message}</p>
        </>
      )}
    </div>
  );
}
